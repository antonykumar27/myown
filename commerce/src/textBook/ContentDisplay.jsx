// EachChapterStudy.js - COMPLETE FIXED VERSION WITH ONE SCROLLBAR
import React, { useMemo, useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  ChevronLeft,
  Trophy,
  Image as ImageIcon,
  Brain,
  Zap,
  AlertCircle,
  ZoomIn,
  BarChart3,
  X,
  Copy,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "katex/dist/katex.min.css";
import { useAuth } from "../common/AuthContext";

// RTK APIs
import {
  useGetTextContentSpecificByIdQuery,
  useUpdateTextBookContentMutation,
} from "../store/api/TextBookApi";

// ✅ CUSTOM SANITIZE SCHEMA - Allow ALL styling attributes
const customSanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    "*": [
      ...(defaultSchema.attributes["*"] || []),
      "style",
      "className",
      "class",
      "align",
      "width",
      "height",
      "bgcolor",
      "border",
      "cellpadding",
      "cellspacing",
    ],
    div: [
      ...(defaultSchema.attributes?.div || []),
      "style",
      "class",
      "className",
      "align",
      "id",
      "data-*",
    ],
    p: [
      ...(defaultSchema.attributes?.p || []),
      "style",
      "class",
      "align",
      "id",
    ],
    span: [...(defaultSchema.attributes?.span || []), "style", "class", "id"],
    h1: [...(defaultSchema.attributes?.h1 || []), "style", "class", "align"],
    h2: [...(defaultSchema.attributes?.h2 || []), "style", "class", "align"],
    h3: [...(defaultSchema.attributes?.h3 || []), "style", "class", "align"],
    h4: [...(defaultSchema.attributes?.h4 || []), "style", "class", "align"],
    h5: [...(defaultSchema.attributes?.h5 || []), "style", "class", "align"],
    h6: [...(defaultSchema.attributes?.h6 || []), "style", "class", "align"],
    table: [
      ...(defaultSchema.attributes?.table || []),
      "style",
      "class",
      "border",
      "cellpadding",
      "cellspacing",
      "width",
    ],
    td: [
      ...(defaultSchema.attributes?.td || []),
      "style",
      "class",
      "colspan",
      "rowspan",
      "width",
      "bgcolor",
    ],
    th: [
      ...(defaultSchema.attributes?.th || []),
      "style",
      "class",
      "colspan",
      "rowspan",
      "width",
      "bgcolor",
    ],
    tr: [...(defaultSchema.attributes?.tr || []), "style", "class", "bgcolor"],
    img: [
      ...(defaultSchema.attributes?.img || []),
      "style",
      "class",
      "width",
      "height",
      "align",
    ],
    ul: [...(defaultSchema.attributes?.ul || []), "style", "class"],
    ol: [...(defaultSchema.attributes?.ol || []), "style", "class"],
    li: [...(defaultSchema.attributes?.li || []), "style", "class"],
    a: [
      ...(defaultSchema.attributes?.a || []),
      "style",
      "class",
      "target",
      "rel",
    ],
    blockquote: [
      ...(defaultSchema.attributes?.blockquote || []),
      "style",
      "class",
    ],
    pre: [...(defaultSchema.attributes?.pre || []), "style", "class"],
    code: [...(defaultSchema.attributes?.code || []), "style", "class"],
    details: [...(defaultSchema.attributes?.details || []), "style", "class"],
    summary: [...(defaultSchema.attributes?.summary || []), "style", "class"],
    figure: [...(defaultSchema.attributes?.figure || []), "style", "class"],
    figcaption: [
      ...(defaultSchema.attributes?.figcaption || []),
      "style",
      "class",
    ],
    iframe: [
      ...(defaultSchema.attributes?.iframe || []),
      "style",
      "class",
      "width",
      "height",
      "allow",
      "allowfullscreen",
    ],
    video: [
      ...(defaultSchema.attributes?.video || []),
      "style",
      "class",
      "width",
      "height",
      "controls",
      "autoplay",
      "loop",
      "muted",
    ],
    audio: [
      ...(defaultSchema.attributes?.audio || []),
      "style",
      "class",
      "controls",
      "autoplay",
      "loop",
    ],
    center: [...(defaultSchema.attributes?.center || []), "style", "class"],
    font: [
      ...(defaultSchema.attributes?.font || []),
      "style",
      "class",
      "color",
      "size",
      "face",
    ],
    marquee: [
      ...(defaultSchema.attributes?.marquee || []),
      "style",
      "class",
      "behavior",
      "direction",
      "scrollamount",
    ],
    blink: [...(defaultSchema.attributes?.blink || []), "style", "class"],
  },
  tagNames: [
    ...(defaultSchema.tagNames || []),
    "center",
    "font",
    "marquee",
    "blink",
    "details",
    "summary",
    "figure",
    "figcaption",
    "iframe",
    "video",
    "audio",
  ],
};

// --- HTML Entity Decoder ---
const decodeHTMLEntities = (text) => {
  if (!text) return "";
  const entities = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&nbsp;": " ",
    "&rsquo;": "'",
    "&mdash;": "—",
    "&ndash;": "–",
    "&copy;": "©",
    "&reg;": "®",
    "&trade;": "™",
    "&euro;": "€",
    "&pound;": "£",
    "&yen;": "¥",
    "&cent;": "¢",
    "&sect;": "§",
    "&para;": "¶",
    "&deg;": "°",
    "&plusmn;": "±",
    "&times;": "×",
    "&divide;": "÷",
    "&micro;": "µ",
    "&middot;": "·",
    "&bull;": "•",
    "&hellip;": "…",
    "&prime;": "′",
    "&Prime;": "″",
    "&lsquo;": "'",
    "&ldquo;": '"',
    "&rdquo;": '"',
    "&laquo;": "«",
    "&raquo;": "»",
    "&lsaquo;": "‹",
    "&rsaquo;": "›",
    "&oline;": "‾",
    "&frasl;": "/",
  };
  return text.replace(
    /&amp;|&lt;|&gt;|&quot;|&#39;|&nbsp;|&rsquo;|&mdash;|&ndash;|&copy;|&reg;|&trade;|&euro;|&pound;|&yen;|&cent;|&sect;|&para;|&deg;|&plusmn;|&times;|&divide;|&micro;|&middot;|&bull;|&hellip;|&prime;|&Prime;|&lsquo;|&rsquo;|&ldquo;|&rdquo;|&laquo;|&raquo;|&lsaquo;|&rsaquo;|&oline;|&frasl;/g,
    (m) => entities[m] || m,
  );
};

// Confidence Score Calculator
const calculateConfidenceScore = (engagement) => {
  const {
    scrollDepth,
    timeSpent,
    expectedTime = 300,
    interactions,
  } = engagement;
  const scrollScore = (scrollDepth / 100) * 0.4;
  const timeRatio = Math.min(timeSpent / expectedTime, 1.5);
  const timeScore = Math.min(timeRatio, 1) * 0.3;
  const totalInteractions =
    (interactions?.clicks || 0) +
    (interactions?.highlights || 0) * 3 +
    (interactions?.notes || 0) * 5;
  const interactionScore = Math.min(totalInteractions / 20, 1) * 0.3;
  return Math.min(scrollScore + timeScore + interactionScore, 1.0);
};

const getConfidenceLevel = (score) => {
  if (score >= 0.8)
    return {
      label: "Expert",
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/30",
    };
  if (score >= 0.5)
    return {
      label: "Steady",
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/30",
    };
  return {
    label: "Surface",
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-900/30",
  };
};

// ✅ Enhanced Image Renderer
const EnhancedImage = ({
  src,
  alt,
  lessonData,
  className,
  style,
  ...props
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageError, setImageError] = useState(false);

  const mediaArray = lessonData?.media || [];
  const normalizedMediaArray = Array.isArray(mediaArray)
    ? mediaArray
    : [mediaArray];
  const matchingMedia = normalizedMediaArray.find((item) => {
    const srcFileName = src.split("/").pop() || src;
    return item.url?.includes(srcFileName) || item.url?.includes(src);
  });

  let imageUrl = src;
  if (matchingMedia) {
    imageUrl = matchingMedia.url;
  } else if (!src?.startsWith("http")) {
    imageUrl = `${import.meta.env.VITE_BACKEND_URL || ""}/uploads/${src}`;
  }

  if (imageError) {
    return (
      <div className="my-8 p-8 bg-slate-100 dark:bg-slate-800 rounded-3xl text-center border border-slate-200 dark:border-slate-700">
        <ImageIcon
          className="mx-auto text-slate-400 dark:text-slate-500 mb-2"
          size={32}
        />
        <p className="text-slate-500 dark:text-slate-400">
          Image could not be loaded
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Filename: {src}
        </p>
      </div>
    );
  }

  return (
    <>
      <motion.figure
        whileHover={{ scale: 1.01 }}
        className="my-10 rounded-3xl border-4 border-white dark:border-slate-800 shadow-2xl"
        style={style}
      >
        <div
          className="relative group cursor-pointer"
          onClick={() => setIsZoomed(true)}
        >
          <img
            src={imageUrl}
            alt={alt || "Lesson image"}
            className={`w-full object-cover ${className || ""}`}
            loading="lazy"
            onError={() => setImageError(true)}
            {...props}
          />
          <div className="absolute top-4 right-4 bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
            <ZoomIn size={20} />
          </div>
        </div>
        {alt && alt !== "Image Description" && (
          <figcaption className="p-4 bg-white dark:bg-slate-800 text-center text-sm font-bold text-slate-500 dark:text-slate-400 border-t dark:border-slate-700">
            {alt}
          </figcaption>
        )}
      </motion.figure>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-5xl max-h-[90vh]"
            >
              <img
                src={imageUrl}
                alt={alt}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- Main Lesson Component ---
const ContentDisplay = () => {
  const { id: lessonId } = useParams();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });
  const [readingMode, setReadingMode] = useState(false);

  const [fontSize, setFontSize] = useState(100);

  const { user } = useAuth();

  // RTK Queries
  const {
    data: lessonData,
    isLoading,
    error,
    refetch,
  } = useGetTextContentSpecificByIdQuery(lessonId);
  const [updateProgress] = useUpdateTextBookContentMutation();

  const chapterId = lessonData?.lesson?.chapterId;
  const subjectId = lessonData?.subjectId;

  // Scroll Progress - USING WINDOW SCROLL
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // State
  const [isMarkedCompleted, setIsMarkedCompleted] = useState(false);
  const [completionType, setCompletionType] = useState(null);
  const [showEngagementStats, setShowEngagementStats] = useState(false);
  const [engagement, setEngagement] = useState({
    scrollDepth: 0,
    activeTime: 0,
    interactions: { clicks: 0, highlights: 0, notes: 0, replays: 0 },
    scrollPattern: [],
  });

  // Track scroll depth on window
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

      setEngagement((prev) => ({
        ...prev,
        scrollDepth: Math.max(
          prev.scrollDepth,
          Math.min(100, Math.round(scrollPercent)),
        ),
      }));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active time
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setEngagement((prev) => ({
        ...prev,
        activeTime: Math.floor((Date.now() - startTime) / 1000),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Theme Toggle
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Markdown Components
  const MarkdownComponents = useMemo(
    () => ({
      div: ({ node, className, children, ...props }) => (
        <div className={className} {...props}>
          {children}
        </div>
      ),
      span: ({ node, className, children, ...props }) => (
        <span className={className} {...props}>
          {children}
        </span>
      ),
      p: ({ node, children, ...props }) => {
        const hasOnlyImage = React.Children.toArray(children).every(
          (child) => child?.type === "img" || child?.props?.src,
        );
        if (hasOnlyImage) return <>{children}</>;
        return (
          <p
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-6 font-medium"
            style={{ fontSize: `${fontSize}%` }}
            {...props}
          >
            {children}
          </p>
        );
      },
      img: ({ node, src, alt, className, style, ...props }) => (
        <EnhancedImage
          src={src}
          alt={alt}
          lessonData={lessonData}
          className={className}
          style={style}
          {...props}
        />
      ),
      h1: ({ node, children, className, style, ...props }) => (
        <h1
          className={`text-4xl md:text-6xl font-black mb-8 dark:text-white leading-tight ${className || ""}`}
          style={{ fontSize: `${fontSize * 1.5}%`, ...style }}
          {...props}
        >
          {children}
          <span className="text-blue-600">.</span>
        </h1>
      ),
      h2: ({ node, children, className, style, ...props }) => (
        <h2
          className={`text-2xl md:text-3xl font-bold mt-12 mb-6 dark:text-slate-100 flex items-center gap-3 ${className || ""}`}
          style={{ fontSize: `${fontSize * 1.3}%`, ...style }}
          {...props}
        >
          <span className="w-2 h-8 bg-indigo-500 rounded-full inline-block" />
          {children}
        </h2>
      ),
      h3: ({ node, children, className, style, ...props }) => (
        <h3
          className={`text-xl md:text-2xl font-semibold mt-8 mb-3 dark:text-slate-200 ${className || ""}`}
          style={{ fontSize: `${fontSize * 1.2}%`, ...style }}
          {...props}
        >
          {children}
        </h3>
      ),
      h4: ({ node, children, className, style, ...props }) => (
        <h4
          className={`text-lg md:text-xl font-medium mt-6 mb-2 dark:text-slate-300 ${className || ""}`}
          style={{ fontSize: `${fontSize * 1.1}%`, ...style }}
          {...props}
        >
          {children}
        </h4>
      ),
      ul: ({ node, children, className, style, ...props }) => (
        <ul
          className={`space-y-3 mb-6 ml-4 list-none ${className || ""}`}
          style={style}
          {...props}
        >
          {children}
        </ul>
      ),
      ol: ({ node, children, className, style, ...props }) => (
        <ol
          className={`space-y-3 mb-6 ml-4 list-decimal marker:text-blue-500 dark:marker:text-blue-400 ${className || ""}`}
          style={style}
          {...props}
        >
          {children}
        </ol>
      ),
      li: ({ node, children, className, style, ...props }) => (
        <li
          className={`flex items-start gap-3 text-slate-700 dark:text-slate-300 text-lg ${className || ""}`}
          style={{ fontSize: `${fontSize}%`, ...style }}
          {...props}
        >
          <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
          <span className="flex-1">{children}</span>
        </li>
      ),
      blockquote: ({ node, children, className, style, ...props }) => (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className={`border-l-4 border-blue-500 bg-blue-50/80 dark:bg-blue-950/30 backdrop-blur-sm p-6 rounded-r-2xl my-8 italic text-slate-700 dark:text-slate-300 shadow-sm ${className || ""}`}
          style={style}
          {...props}
        >
          {children}
        </motion.div>
      ),
      code: ({ node, inline, className, children, ...props }) => {
        const match = /language-(\w+)/.exec(className || "");
        if (!inline && match) {
          return (
            <div className="my-8 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="bg-slate-100 dark:bg-slate-900 px-4 py-2 text-xs text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <span>{match[1]}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      String(children).replace(/\n$/, ""),
                    );
                    toast.success("Copied to clipboard!");
                  }}
                  className="hover:text-slate-900 dark:hover:text-slate-200"
                >
                  <Copy size={14} />
                </button>
              </div>
              <SyntaxHighlighter
                style={isDarkMode ? vscDarkPlus : oneLight}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  padding: "2rem",
                  fontSize: "1rem",
                  margin: 0,
                  background: isDarkMode ? "#1e1e1e" : "#fafafa",
                }}
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </div>
          );
        }
        return (
          <code
            className={`bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md font-bold ${className || ""}`}
            {...props}
          >
            {children}
          </code>
        );
      },
      table: ({ node, children, className, style, ...props }) => (
        <div className="my-8 overflow-x-auto">
          <table
            className={`min-w-full border-collapse border border-slate-200 dark:border-slate-700 ${className || ""}`}
            style={style}
            {...props}
          >
            {children}
          </table>
        </div>
      ),
      th: ({ node, children, className, style, ...props }) => (
        <th
          className={`border border-slate-200 dark:border-slate-700 px-4 py-3 text-left font-semibold dark:text-white ${className || ""}`}
          style={style}
          {...props}
        >
          {children}
        </th>
      ),
      td: ({ node, children, className, style, ...props }) => (
        <td
          className={`border border-slate-200 dark:border-slate-700 px-4 py-3 dark:text-slate-300 ${className || ""}`}
          style={style}
          {...props}
        >
          {children}
        </td>
      ),
      a: ({ node, href, children, className, style, ...props }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors ${className || ""}`}
          style={style}
          {...props}
        >
          {children}
        </a>
      ),
    }),
    [lessonData, isDarkMode, fontSize],
  );

  // Calculate confidence score
  const confidenceScore = useMemo(() => {
    return calculateConfidenceScore({
      scrollDepth: engagement.scrollDepth,
      timeSpent: engagement.activeTime,
      expectedTime: 300,
      interactions: engagement.interactions,
    });
  }, [engagement]);

  const confidenceLevel = getConfidenceLevel(confidenceScore);

  // Check existing progress
  useEffect(() => {
    if (user && lessonId) {
      const progressKey = `progress_${user._id}_${lessonId}`;
      const savedProgress = JSON.parse(localStorage.getItem(progressKey));
      if (savedProgress) {
        setIsMarkedCompleted(savedProgress.completed);
        setCompletionType(savedProgress.completionType);
      }
    }
  }, [user, lessonId]);

  // Auto-completion logic
  useEffect(() => {
    if (isMarkedCompleted || !user) return;
    const shouldAutoComplete =
      engagement.scrollDepth >= 85 &&
      engagement.activeTime >= 120 &&
      confidenceScore >= 0.6;
  }, [engagement, confidenceScore, user, isMarkedCompleted]);

  // Process content
  const processedContent = useMemo(() => {
    if (!lessonData?.lesson?.content) return "";
    let content = decodeHTMLEntities(lessonData.lesson.content);
    content = content.replace(/\\\\/g, "\\");
    return content.trim();
  }, [lessonData]);

  // Loading and Error states
  if (isLoading) return <LoadingPulse />;
  if (error) return <ErrorUI onRetry={refetch} />;

  const lesson = lessonData?.lesson;

  // ⭐️ FIXED RETURN STATEMENT - NO MORE DOUBLE SCROLLBAR ⭐️
  return (
    <>
      {/* Progress Bar - fixed at top */}

      <div className=" max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header Bento Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative p-8 bg-indigo-600 rounded-4xl text-white flex flex-col justify-between min-h-55 shadow-xl">
            <button
              onClick={() => navigate(-1)}
              className="absolute top-6 left-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="absolute top-6 right-6 opacity-20">
              <BarChart3 size={28} />
            </div>
            <div className="mt-10">
              <p className="text-indigo-200 text-sm font-semibold tracking-wide">
                Focus Score
              </p>
              <p className="text-4xl font-extrabold mt-2">
                {(confidenceScore * 100).toFixed(0)}%
              </p>
              <p className="text-indigo-100 text-sm mt-1">
                {confidenceLevel.label} Level
              </p>
            </div>
          </div>
          <div className="md:col-span-2 p-8 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-indigo-500 font-black text-sm mb-4 uppercase tracking-tighter">
              <Brain size={16} />
              <span>Personalized Learning Path</span>
            </div>
            <h1 className="text-3xl font-black dark:text-white">
              {lesson?.title || "Loading..."}
            </h1>
            {lesson?.description && (
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                {lesson.description}
              </p>
            )}
          </div>
        </div>

        {/* Main Content */}
        {/* Main Content - FIXED: Removed prose class that causes extra scroll */}
        <article className="relative">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[
              rehypeRaw,
              [rehypeSanitize, customSanitizeSchema],
              rehypeKatex,
            ]}
            components={MarkdownComponents}
          >
            {processedContent}
          </ReactMarkdown>
        </article>

        {/* Engagement Stats Panel */}
        <AnimatePresence>
          {showEngagementStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800"
            >
              <h3 className="font-bold text-lg mb-4 dark:text-white flex items-center gap-2">
                <BarChart3 size={20} className="text-indigo-500" />
                Engagement Analytics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Scroll Depth</p>
                  <p className="text-2xl font-bold dark:text-white">
                    {engagement.scrollDepth}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Time Active</p>
                  <p className="text-2xl font-bold dark:text-white">
                    {Math.floor(engagement.activeTime / 60)}m{" "}
                    {engagement.activeTime % 60}s
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Interactions</p>
                  <p className="text-2xl font-bold dark:text-white">
                    {engagement.interactions.clicks}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Confidence</p>
                  <p className="text-2xl font-bold dark:text-white">
                    {(confidenceScore * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completion UI */}
        <AnimatePresence mode="wait">
          {isMarkedCompleted ? (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-8 p-10 bg-emerald-500 rounded-[3rem] text-white text-center shadow-2xl shadow-emerald-500/20"
            >
              <Trophy size={60} className="mx-auto mb-6" />
              <h2 className="text-3xl font-black mb-2">Knowledge Locked In!</h2>
              <p className="font-bold mb-8 opacity-90">
                {completionType === "auto"
                  ? "Great engagement! The system auto-completed this lesson."
                  : "You've mastered this lesson!"}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => navigate(`/chapter/${chapterId}/quiz`)}
                  className="px-8 py-4 bg-white text-emerald-600 rounded-2xl font-black text-lg hover:shadow-xl transition-all"
                >
                  Start Mastery Quiz
                </button>
                <button
                  onClick={() => navigate(`/chapter/${chapterId}/dashboard`)}
                  className="px-8 py-4 bg-emerald-600 border-2 border-emerald-400 rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all"
                >
                  Chapter Dashboard
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="incomplete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12 flex justify-center"
            ></motion.div>
          )}
        </AnimatePresence>

        {/* Learning Tip */}
        {!isMarkedCompleted && confidenceScore < 0.5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 p-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-3xl"
          >
            <div className="flex items-center gap-3">
              <AlertCircle
                className="text-amber-600 dark:text-amber-400"
                size={24}
              />
              <div>
                <h4 className="font-semibold text-amber-800 dark:text-amber-300">
                  Learning Tip
                </h4>
                <p className="text-amber-700 dark:text-amber-400 text-sm">
                  Spend more time reading and interacting with content for
                  better understanding.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

// --- Loading Pulse Component ---
const LoadingPulse = () => (
  <div className=" bg-white dark:bg-slate-950 p-8 flex flex-col gap-6">
    <div className="h-20 bg-slate-100 dark:bg-slate-900 rounded-3xl animate-pulse w-full" />
    <div className="max-w-4xl mx-auto w-full space-y-6">
      <div className="h-64 bg-slate-100 dark:bg-slate-900 rounded-[3rem] animate-pulse" />
      <div className="h-8 bg-slate-100 dark:bg-slate-900 rounded-full animate-pulse w-3/4" />
      <div className="h-4 bg-slate-100 dark:bg-slate-900 rounded-full animate-pulse w-full" />
      <div className="h-4 bg-slate-100 dark:bg-slate-900 rounded-full animate-pulse w-5/6" />
    </div>
  </div>
);

// --- Error UI ---
const ErrorUI = ({ onRetry }) => (
  <div className=" bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center p-6">
    <div className="max-w-md text-center">
      <div className="text-8xl mb-6">🚀</div>
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
        Connection Lost
      </h3>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        We couldn't load the lesson. It might be orbiting in digital space.
      </p>
      <button
        onClick={onRetry}
        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-shadow"
      >
        Reconnect Now
      </button>
    </div>
  </div>
);

export default ContentDisplay;
