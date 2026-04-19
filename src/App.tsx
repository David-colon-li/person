import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Link as LinkIcon, Wind, CloudRain, Sun, Sparkles, Ghost, Award, GraduationCap, Laptop } from 'lucide-react';
import ProjectDetail from './ProjectDetail';
import { WeatherCanvas, WeatherType } from './WeatherCanvas';
import { RobinBird } from './components/RobinBird';

const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4";

// 模拟数据库数据 (后续将替换为 Supabase 数据获取)
const MOCK_RESOURCES = [
  { id: 1, title: "Minimax", tags: ["AI网页工具"], link: "https://agent.minimaxi.com", note: "" },
  { id: 2, title: "happycapy", tags: ["AI网页工具"], link: "https://happycapy.ai", note: "支持Claude最新模型..." },
  { id: 3, title: "MuleRun", tags: ["AI网页工具"], link: "https://mulerun.com/chat", note: "" },
  { id: 4, title: "Arena", tags: ["AI网页工具"], link: "https://arena.ai/", note: "AI 角斗场" },
  { id: 5, title: "Gemini", tags: ["AI网页工具"], link: "https://gemini.google.com", note: "前端设计的神，需要配..." },
  { id: 6, title: "NotebookLM", tags: ["AI网页工具"], link: "https://notebooklm.google.com", note: "AI播客、AIppt、AI知识库" },
  { id: 7, title: "秋芝2046 - QClaw", tags: ["OpenClaw"], link: "https://qclawai.com", note: "本地化OpenClaw" },
  { id: 8, title: "OpenClaw中国特色用例", tags: ["OpenClaw"], link: "https://github.com/Alex...", note: "" },
  { id: 9, title: "skillhub", tags: ["OpenClaw", "skill市场"], link: "https://skillhub.tencent...", note: "" },
  { id: 10, title: "OpenClaw skill市场", tags: ["OpenClaw", "skill市场"], link: "https://cn.clawhub-mirr...", note: "中国镜像站" },
];

// 模拟AI项目词云数据 (后续将替换为 Supabase 数据获取)
const MOCK_PROJECTS = [
  { id: 1, title: "多模态知识图谱", link: "#project/1", weight: 3.5, top: "20%", left: "15%", moveY: -20, moveX: 15, duration: 15, delay: 0 },
  { id: 2, title: "古籍OCR智能校对", link: "#project/2", weight: 2.2, top: "45%", left: "60%", moveY: 25, moveX: -20, duration: 18, delay: 2 },
  { id: 3, title: "数字出版排版引擎", link: "#project/3", weight: 1.8, top: "75%", left: "20%", moveY: -15, moveX: 30, duration: 14, delay: 1 },
  { id: 4, title: "RAG 垂直检索引擎", link: "#project/4", weight: 2.8, top: "15%", left: "70%", moveY: 20, moveX: 10, duration: 16, delay: 3 },
  { id: 5, title: "文化遗产数字化", link: "#project/5", weight: 2.0, top: "65%", left: "80%", moveY: -30, moveX: -15, duration: 20, delay: 0 },
  { id: 6, title: "AI 长文本辅助写作", link: "#project/6", weight: 3.0, top: "85%", left: "65%", moveY: 15, moveX: -25, duration: 17, delay: 2 },
  { id: 7, title: "跨语言语义网络", link: "#project/7", weight: 2.4, top: "55%", left: "10%", moveY: -25, moveX: 20, duration: 19, delay: 1 },
  { id: 8, title: "历史实体关系挖掘", link: "#project/8", weight: 1.6, top: "35%", left: "40%", moveY: 30, moveX: -10, duration: 15, delay: 4 },
  { id: 9, title: "自动化翻译工作流", link: "#project/9", weight: 1.9, top: "10%", left: "45%", moveY: -15, moveX: 25, duration: 13, delay: 2 },
  { id: 10, title: "Agentic 思维脑图", link: "#project/10", weight: 2.6, top: "80%", left: "35%", moveY: 20, moveX: 15, duration: 16, delay: 0 },
];

const Navigation = ({ weather, onCycleWeather, logoRef }: { weather: WeatherType, onCycleWeather: () => void, logoRef: React.RefObject<HTMLDivElement | null> }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-10 bg-white/50 backdrop-blur-sm lg:px-15">
      <div ref={logoRef} className="text-[32px] font-display font-bold tracking-[-1px]">
        Li®
      </div>
      
      <div className="hidden md:flex items-center space-x-10">
        <a href="#" className="font-sans text-[15px] font-medium text-black relative group">
          首页
          <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#f3a361] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </a>
        <a href="#resources" className="font-sans text-[15px] font-medium text-brand-muted hover:text-black transition-colors relative group">
          AI工具
          <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#f3a361] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </a>
        <a href="#projects" className="font-sans text-[15px] font-medium text-brand-muted hover:text-black transition-colors relative group">
          AI项目
          <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#f3a361] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </a>
        <a href="#about" className="font-sans text-[15px] font-medium text-brand-muted hover:text-black transition-colors relative group">
          关于我
          <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#f3a361] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </a>
      </div>

      <motion.button 
        onClick={onCycleWeather}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-3 bg-black/5 hover:bg-black/10 text-brand-black rounded-full transition-colors flex items-center justify-center"
        aria-label="Toggle Weather Effect"
      >
        {weather === 'sakura' ? <Wind className="w-5 h-5" /> : weather === 'rain' ? <CloudRain className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </motion.button>
    </nav>
  );
};

const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState(0);
  const rafId = useRef<number>();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const fadeDuration = 0.5;
    const resetDelay = 100;

    const update = () => {
      const { currentTime, duration } = video;
      
      if (duration > 0) {
        if (currentTime < fadeDuration) {
          setOpacity(currentTime / fadeDuration);
        } else if (currentTime > duration - fadeDuration) {
          setOpacity((duration - currentTime) / fadeDuration);
        } else {
          setOpacity(1);
        }

        if (video.ended || currentTime >= duration) {
          setOpacity(0);
          setTimeout(() => {
            video.currentTime = 0;
            video.play().catch(() => {});
          }, resetDelay);
        }
      }
      rafId.current = requestAnimationFrame(update);
    };

    rafId.current = requestAnimationFrame(update);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 top-0 z-10 overflow-hidden pointer-events-none" 
      style={{ opacity }}
    >
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        autoPlay
        className="h-full w-full object-cover"
      />
      {/* 修改蒙版渐变：顶部白色保证文字清晰度，中部逐渐透明透出视频，底部极少遮挡以配合毛玻璃 */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/40 to-black/5" />
    </div>
  );
};

// 可展开项目卡片（主卡展开 + 侧卡收拢）
const ProjectGrid = () => {
  const [activeId, setActiveId] = useState(MOCK_PROJECTS[0]?.id ?? 1);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const scrollCards = (direction: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    const distance = Math.max(280, Math.floor(el.clientWidth * 0.42));
    el.scrollBy({ left: direction === 'right' ? distance : -distance, behavior: 'smooth' });
  };

  useEffect(() => {
    updateScrollState();
    const onResize = () => updateScrollState();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="w-full relative z-10 px-2 lg:px-4">
      <div className="mb-5 flex items-center justify-between text-xs tracking-[0.16em] uppercase text-brand-black/55">
        <span>精选项目</span>
        <span>向右滑动查看更多</span>
      </div>
      <button
        type="button"
        onClick={() => scrollCards('left')}
        disabled={!canScrollLeft}
        className="hidden lg:flex absolute left-[-6px] top-[56%] -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full border border-white/55 bg-white/45 backdrop-blur-xl text-black/70 shadow-[0_8px_24px_rgba(148,163,184,0.28)] transition-all hover:bg-white/65 hover:text-black disabled:opacity-35 disabled:cursor-not-allowed"
        aria-label="查看左侧项目"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => scrollCards('right')}
        disabled={!canScrollRight}
        className="hidden lg:flex absolute right-[-6px] top-[56%] -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full border border-white/55 bg-white/45 backdrop-blur-xl text-black/70 shadow-[0_8px_24px_rgba(148,163,184,0.28)] transition-all hover:bg-white/65 hover:text-black disabled:opacity-35 disabled:cursor-not-allowed"
        aria-label="查看右侧项目"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      <div
        ref={trackRef}
        onScroll={updateScrollState}
        className="overflow-x-auto px-1 lg:px-3 pt-4 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="mx-auto flex min-w-max max-w-[1220px] snap-x snap-mandatory gap-4 lg:gap-5 lg:h-[460px]">
        {MOCK_PROJECTS.map((item) => {
          const isActive = item.id === activeId;

          return (
            <motion.article
              key={item.id}
              layout
              animate={{
                scale: isActive ? 1.02 : 1,
                y: isActive ? -4 : 0,
              }}
              onMouseEnter={() => setActiveId(item.id)}
              onFocus={() => setActiveId(item.id)}
              onClick={() => setActiveId(item.id)}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              className={[
                "group snap-start relative isolate overflow-hidden rounded-[28px] backdrop-blur-2xl",
                "border transition-[height,box-shadow,transform,background-color,border-color] duration-500 ease-out",
                isActive
                  ? "bg-white/32 border-white/62 shadow-[0_24px_58px_rgba(148,163,184,0.35)]"
                  : "bg-white/12 border-white/28 shadow-[0_10px_24px_rgba(148,163,184,0.2)] hover:bg-white/22 hover:border-white/45",
                "h-[280px] lg:h-full",
                "w-[82vw] max-w-[420px] min-w-[320px] lg:min-w-0",
                isActive ? "lg:basis-[520px]" : "lg:basis-[170px]",
              ].join(" ")}
              aria-label={`打开项目：${item.title}`}
            >
              <div
                className={[
                  "absolute inset-0 z-0 transition-opacity duration-500",
                  isActive
                    ? "opacity-100 bg-[radial-gradient(circle_at_16%_18%,rgba(255,255,255,0.62),transparent_48%),linear-gradient(155deg,rgba(255,255,255,0.28),rgba(191,219,254,0.26)_48%,rgba(226,232,240,0.5))]"
                    : "opacity-85 bg-[radial-gradient(circle_at_16%_18%,rgba(255,255,255,0.42),transparent_48%),linear-gradient(155deg,rgba(255,255,255,0.1),rgba(191,219,254,0.15)_48%,rgba(226,232,240,0.28))]",
                ].join(" ")}
              />
              <div className="absolute -inset-10 z-0 rounded-[40px] bg-[radial-gradient(circle_at_20%_10%,rgba(251,191,36,0.22),transparent_45%),radial-gradient(circle_at_90%_90%,rgba(14,165,233,0.22),transparent_40%)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute inset-y-0 right-0 w-[45%] bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.45),transparent)] translate-x-[85%] group-hover:translate-x-[-20%] transition-transform duration-700 ease-out" />

              <div className="relative z-10 h-full p-6 lg:p-7 flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-white/20 border border-white/35 text-brand-black/70">
                    PROJECT-{String(item.id).padStart(3, "0")}
                  </span>
                  <span className="ml-auto text-[11px] tracking-[0.16em] uppercase text-brand-black/65">Lab Note</span>
                </div>

                <div className="mt-auto">
                  <h3 className="text-2xl lg:text-[34px] leading-tight font-display font-bold text-black pr-4">
                    {item.title}
                  </h3>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                        className="mt-4 space-y-4"
                      >
                        <p className="max-w-[520px] text-sm lg:text-[15px] text-brand-black/70 leading-relaxed">
                          探索此 AI 实验的运行架构与设计哲学，进入项目详情查看核心流程、数据逻辑与关键交互设计。
                        </p>
                        <a
                          href={item.link}
                          className="inline-flex items-center gap-2 text-sm font-medium text-black/90"
                        >
                          查看项目详情
                          <span className="w-8 h-8 rounded-full border border-white/50 bg-white/40 backdrop-blur-md flex items-center justify-center">
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.article>
          );
        })}
        </div>
      </div>
    </div>
  );
};

// 资源库数据表格组件
const ResourceTable = () => {
  return (
    <div className="w-full pb-10">
      <div className="relative rounded-[24px] border border-white/45 bg-white/14 backdrop-blur-xl px-4 py-4 shadow-[0_10px_30px_rgba(148,163,184,0.16)]">
        <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-[radial-gradient(circle_at_12%_8%,rgba(255,255,255,0.35),transparent_40%),linear-gradient(145deg,rgba(255,255,255,0.12),rgba(191,219,254,0.14)_45%,rgba(226,232,240,0.2))]" />
        <div className="relative w-full overflow-x-auto">
      <div className="min-w-[800px]">
        {/* 表头 */}
        <div className="grid grid-cols-[2fr_1.5fr_3fr_3fr] gap-6 py-4 px-4 -mx-4 border-b border-black/20 text-sm font-medium text-brand-muted">
          <div>标题</div>
          <div>标签</div>
          <div>链接</div>
          <div>备注</div>
        </div>
        
        {/* 列表内容 */}
        <div className="divide-y divide-black/5 border-b border-black/5">
          {MOCK_RESOURCES.map((item) => (
            <div 
              key={item.id} 
              className="group relative grid grid-cols-[2fr_1.5fr_3fr_3fr] gap-6 py-5 px-4 -mx-4 transition-all duration-300 hover:-translate-y-0.5 before:absolute before:inset-0 before:border-b-2 before:border-[#f3a361] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:z-[-1]"
            >
              <div className="font-medium text-black flex items-center group-hover:text-black group-hover:font-semibold transition-all">{item.title}</div>
              <div className="flex items-center gap-2 flex-wrap">
                {item.tags.map(tag => (
                  <span 
                    key={tag} 
                    className={`px-3 py-1 rounded-full text-xs font-medium 
                      ${tag.includes('OpenClaw') ? 'bg-cyan-50 text-cyan-700' : 
                        tag.includes('skill') ? 'bg-orange-50 text-orange-700' : 
                        'bg-blue-50 text-blue-700'}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center text-sm">
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-brand-muted hover:text-black hover:underline truncate transition-colors"
                >
                  <LinkIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{item.link}</span>
                </a>
              </div>
              <div className="flex items-center text-sm text-brand-muted">{item.note}</div>
            </div>
          ))}
        </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default function App() {
  const [route, setRoute] = useState(() => window.location.hash);
  const [weather, setWeather] = useState<WeatherType>('sakura');
  const [isBirdFlying, setIsBirdFlying] = useState(false);
  
  const logoRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  const cycleWeather = () => {
    if (weather === 'sakura') setWeather('rain');
    else if (weather === 'rain') setWeather('none');
    else setWeather('sakura');
  };

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const isProjectDetail = route.startsWith('#project/');
  const projectId = isProjectDetail ? route.replace('#project/', '') : '';

  return (
    <>
      <VideoBackground />
      <WeatherCanvas type={weather} />

      {/* 始终固定的视口底层元素（分离出滚动容器，避免 transform 失效） */}
      <AnimatePresence>
        {!isProjectDetail && (
          <motion.div
            key="home-fixed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-0 pointer-events-none"
          >
            {/* Global Theme Labels */}
            <div className="absolute right-10 top-1/2 -rotate-90 origin-right translate-y-1/2 z-30">
              <span className="text-micro text-brand-muted">向下滑动探索</span>
            </div>

            <div className="absolute bottom-10 left-10 right-10 flex justify-between z-30">
              <span className="text-micro text-brand-muted">始于二零二四</span>
              <span className="text-micro text-brand-muted hidden sm:block">人文与技术的共振</span>
              <span className="text-micro text-brand-muted">基于 AI 与 数字人文 视角</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isProjectDetail ? (
          <ProjectDetail id={projectId} />
        ) : (
          <motion.main 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 min-h-screen bg-transparent selection:bg-black selection:text-white overflow-x-hidden"
          >
            <Navigation weather={weather} onCycleWeather={cycleWeather} logoRef={logoRef} />

            <section className="relative z-20 flex flex-col px-10 lg:px-15 pt-40 pb-20 min-h-[80vh] justify-center">
            <div className="max-w-[1000px] space-y-10">
              <h1 className="text-5xl md:text-[88px] font-display font-normal tracking-tight-heading leading-tight-heading animate-fade-rise opacity-0">
                山谷里的AI Lab
              </h1>
              
              <p className="max-w-[550px] text-[18px] font-sans leading-relaxed text-white animate-fade-rise opacity-0 delay-200 drop-shadow-md">
                Thinking with Machines
              </p>
              
              <div className="pt-2 animate-fade-rise opacity-0 delay-400">
                <motion.a
                  ref={buttonRef}
                  href="#resources"
                  onClick={() => setIsBirdFlying(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block px-10 py-[18px] bg-black text-white rounded-full font-sans text-base font-medium relative overflow-hidden"
                >
                  <span className="relative z-10">进入知识库</span>
                  {/* Subtle shine effect */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                </motion.a>
                
                <RobinBird 
                  isFlying={isBirdFlying}
                  startElRef={buttonRef}
                  endElRef={logoRef}
                  onLand={() => setIsBirdFlying(false)}
                />
              </div>
            </div>
          </section>

          {/* ------ 下方所有内容区：采用全局统一的柔和渐变毛玻璃底板 ------ */}
          <div className="relative z-20">
            {/* 顶端渐变融合的浅色毛玻璃背景，覆盖整个下半部分 */}
            <div 
              className="absolute inset-0 bg-white/15 backdrop-blur-[20px] -z-10 pointer-events-none"
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 300px)',
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 300px)'
              }}
            />

            {/* 资源列表区域 (待对接 Supabase) */}
            <section id="resources" className="relative min-h-screen px-10 lg:px-15 pt-[300px] pb-32">
              <div className="max-w-[1200px] mx-auto space-y-12">
                <div className="space-y-4">
                  <h2 className="text-4xl font-display font-bold text-black tracking-tight">机器工具箱</h2>
                  <p className="text-brand-muted font-sans font-medium text-lg">收集与整理前沿的 AI 网页工具与应用框架。</p>
                </div>
                
                <ResourceTable />
                
              </div>
            </section>

            {/* AI项目 漂浮词云区域 (待对接 Supabase) */}
            <section id="projects" className="relative min-h-[80vh] flex flex-col justify-center items-center px-10 lg:px-15 py-32">
              <div className="max-w-[1200px] w-full">
                <div className="space-y-4 mb-16 text-center">
                  <h2 className="text-4xl font-display font-bold text-black tracking-tight">AI 实验项目</h2>
                  <p className="text-brand-muted font-sans font-medium text-lg">触碰卡片，探索思维具象化的数字果实与实验架构。</p>
                </div>
                <ProjectGrid />
              </div>
            </section>

            {/* 关于我 区域 - 极简浮现式 */}
            <section id="about" className="relative min-h-[80vh] flex flex-col justify-center items-center px-6 pt-32 pb-[98px]">
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center text-center max-w-[800px] w-full"
              >
                {/* Avatar Center */}
                <div className="w-32 md:w-48 mb-6 transform hover:-translate-y-2 hover:scale-105 transition-all duration-500">
                  {/* CSS 黑魔法：使用 mix-blend-multiply 可以让白底直接滤除，与毛玻璃完美融合，同时避免扣图导致的锯齿 */}
                  <img src={`/avatar.png?c=${Date.now()}`} alt="David Li Avatar" className="w-full h-auto object-contain mix-blend-multiply contrast-[1.05]" />
                </div>
                
                <h2 className="text-4xl md:text-5xl font-display font-bold text-black tracking-widest mb-6 uppercase">David Li</h2>
                
                {/* Info Tags - High-end Editorial Style with Cute Icons */}
                <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-3 text-[14px] md:text-[15px] font-display text-brand-black/80 tracking-widest">
                  
                  <span className="drop-shadow-sm hover:text-black transition-colors flex items-center gap-1.5 focus:outline-none">
                    <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span>前美团产运兼AI顾问</span>
                  </span>
                  
                  <span className="text-brand-muted/30 font-thin flex-shrink-0">|</span>
                  
                  <span className="drop-shadow-sm hover:text-black transition-colors flex items-center gap-1.5 focus:outline-none">
                    <Laptop className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>计算机二/三级 <span className="font-sans italic text-brand-muted/70 tracking-normal text-[13px]">（会修但不想修）</span></span>
                  </span>
                  
                  <span className="text-brand-muted/30 font-thin flex-shrink-0">|</span>
                  
                  <span className="drop-shadow-sm hover:text-black transition-colors flex items-center gap-1.5 focus:outline-none">
                    <Award className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    <span>CET-6 通关者</span>
                  </span>
                  
                  <span className="text-brand-muted/30 font-thin flex-shrink-0">|</span>
                  
                  <span className="drop-shadow-sm hover:text-black transition-colors flex items-center gap-1.5 focus:outline-none">
                    <Ghost className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span>INFJ社恐型运营</span>
                  </span>
                  
                  <span className="text-brand-muted/30 font-thin flex-shrink-0">|</span>
                  
                  <span className="drop-shadow-sm hover:text-black transition-colors flex items-center gap-1.5 focus:outline-none">
                    <GraduationCap className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>硕士研究生 <span className="font-sans italic text-brand-muted/70 tracking-normal text-[13px]">（快毕业版）</span></span>
                  </span>
                </div>

              </motion.div>
            </section>
          </div>
        </motion.main>
      )}
    </AnimatePresence>
    </>
  );
}
