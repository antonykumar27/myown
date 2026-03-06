// // controllers/gameController.js
// const Transaction = require("../models/Transaction");
// const User = require("../models/User");
// const GameProgress = require("../models/GameProgress");
// const Badge = require("../models/Badge");
// const { checkAndAwardBadges } = require("../utils/badgeChecker");

// exports.getQuestion = async (req, res) => {
//   try {
//     const { level, topic } = req.query;
//     const userId = req.user.id;

//     let query = {};
//     if (level) query.level = level;
//     if (topic) query.topic = topic;

//     // Get user's progress to avoid repeated questions
//     const progress = await GameProgress.findOne({ userId });
//     const answeredIds = progress.answeredQuestions.map((q) =>
//       q.questionId.toString(),
//     );

//     // Get random question not answered before
//     const questions = await Transaction.aggregate([
//       { $match: { ...query, _id: { $nin: answeredIds } } },
//       { $sample: { size: 1 } },
//     ]);

//     if (questions.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No more questions in this level",
//       });
//     }

//     res.json({
//       success: true,
//       data: questions[0],
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// exports.submitAnswer = async (req, res) => {
//   try {
//     const { questionId, answer, timeTaken } = req.body;
//     const userId = req.user.id;

//     // Get question
//     const question = await Transaction.findById(questionId);
//     if (!question) {
//       return res.status(404).json({
//         success: false,
//         message: "Question not found",
//       });
//     }

//     // Check answer
//     const isCorrect = checkAnswer(question, answer);

//     // Update question stats
//     question.timesAnswered += 1;
//     if (isCorrect) question.correctCount += 1;
//     question.updateSuccessRate();
//     await question.save();

//     // Get user and progress
//     const user = await User.findById(userId);
//     const progress = await GameProgress.findOne({ userId });

//     // Calculate points
//     let pointsEarned = 0;
//     if (isCorrect) {
//       // Base points
//       pointsEarned = 10;

//       // Streak bonus
//       pointsEarned += user.streak * 2;

//       // Speed bonus
//       if (timeTaken < 10) pointsEarned += 5;

//       // Update user stats
//       user.points += pointsEarned;
//       user.streak += 1;
//       user.maxStreak = Math.max(user.maxStreak, user.streak);
//       user.correctAnswers += 1;

//       // Level up check
//       const pointsNeeded = user.level * 100;
//       if (user.points >= pointsNeeded) {
//         user.level += 1;
//       }
//     } else {
//       user.streak = 0;
//     }

//     user.totalQuestions += 1;
//     user.updateAccuracy();
//     await user.save();

//     // Save to progress
//     progress.answeredQuestions.push({
//       questionId,
//       correct: isCorrect,
//       timeTaken,
//       pointsEarned: isCorrect ? pointsEarned : 0,
//     });

//     // Check for weak areas
//     if (!isCorrect) {
//       const weakArea = progress.weakAreas.find(
//         (w) => w.topic === question.topic,
//       );
//       if (weakArea) {
//         weakArea.mistakeCount += 1;
//       } else {
//         progress.weakAreas.push({
//           topic: question.topic,
//           mistakeCount: 1,
//         });
//       }
//     }

//     await progress.save();

//     // Check and award badges
//     const newBadges = await checkAndAwardBadges(userId);

//     // Emit socket event for real-time updates
//     const io = req.app.get("io");
//     io.emit("score-update", { userId, points: user.points });

//     res.json({
//       success: true,
//       data: {
//         correct: isCorrect,
//         pointsEarned: isCorrect ? pointsEarned : 0,
//         newLevel: user.level,
//         newBadges,
//         explanation: question.explanation,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // Helper function to check answer
// const checkAnswer = (question, answer) => {
//   switch (question.questionType) {
//     case "debit-credit":
//       return (
//         answer.debit === question.correctDebit &&
//         answer.credit === question.correctCredit
//       );
//     case "journal-entry":
//       return (
//         answer.debit === question.correctEntry.debit &&
//         answer.credit === question.correctEntry.credit &&
//         answer.amount === question.correctEntry.amount
//       );
//     default:
//       return false;
//   }
// };
