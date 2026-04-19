import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Copy, CheckCircle2 } from 'lucide-react';

interface ProjectDetailProps {
  id: string;
}

// 模拟详情页数据
const MOCK_DETAIL_DATA: Record<string, any> = {
  "1": {
    title: "多模态知识图谱",
    subtitle: "Multimodal Knowledge Graph for Ancient Texts",
    tags: ["Graph Theory", "Computer Vision", "NLP", "2026"],
    intro: "这是融合计算机视觉与自然语言处理的实验性项目。旨在将古籍中残损的视觉信息、印章刻本与纯文本语义，共同映射为可计算、可推理的高维向量图谱。",
    promptText: `You are an expert in Classical Chinese Philology and Graph Theory. 
Your task is to analyze the provided ancient manuscript image and its OCR output.

1. Extract all named entities (Persons, Places, Official Titles).
2. Identify the visual layout features and correlate them with textual semantics.
3. Output a strictly formatted JSON representing the node-edge relationships.`,
    body: [
      {
        heading: "研究背景",
        content: "在数字人文领域，传统的文本挖掘往往忽略了载体本身的视觉信息（如版式、批注、印鉴等）。本实验通过构建多模态 RAG 架构，让 AI 能够同时理解「图」与「文」的深层关联。"
      },
      {
        heading: "技术挑战",
        content: "最大的难点在于古籍异体字与手写墨迹的特征提取。我们摒弃了传统的单线 OCR 流程，转而使用 Vision-Language Models (如 Claude 3 或 Gemini Pro Vision) 进行端到端的特征图谱构建。"
      }
    ]
  }
};

const ProjectDetail = ({ id }: ProjectDetailProps) => {
  const [copied, setCopied] = useState(false);
  
  // 如果找不到对应 ID 数据，默认用第一条数据显示模拟
  const data = MOCK_DETAIL_DATA[id] || MOCK_DETAIL_DATA["1"];

  const handleCopy = () => {
    navigator.clipboard.writeText(data.promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.main 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 min-h-screen bg-white/70 backdrop-blur-[40px] text-brand-black pb-32 border-x border-white/40 max-w-[1200px] mx-auto shadow-2xl"
    >
      {/* 极简顶导 */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 md:px-12 py-8 bg-transparent max-w-[1200px] mx-auto">
        <a 
          href="#" 
          className="group flex items-center gap-2 text-sm font-sans font-medium text-brand-muted hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          返回首页
        </a>
      </nav>

      {/* 内容区 */}
      <article className="pt-40 px-6 md:px-12 max-w-[760px] mx-auto">
        {/* 头部元数据 */}
        <header className="mb-16 space-y-8">
          <div className="flex flex-wrap items-center gap-3">
            {data.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-black/5 rounded-full text-xs font-sans tracking-widest uppercase text-brand-muted">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-[64px] leading-[1.1] tracking-tight-heading font-display font-normal text-black">
            {data.title}
          </h1>
          <div className="text-xl md:text-2xl font-display italic text-brand-muted">
            {data.subtitle}
          </div>
        </header>

        {/* 简介 */}
        <div className="mb-16 text-lg md:text-xl font-sans leading-relaxed text-brand-muted">
          {data.intro}
        </div>

        {/* System Prompt 展示区 (参考 mmguo.dev 风格) */}
        <section className="mb-20">
          <h3 className="text-sm font-sans uppercase tracking-[2px] text-brand-muted mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-black rounded-full" />
            Core System Prompt
          </h3>
          <div className="relative group">
            <div className="bg-[#f7f7f7] rounded-2xl p-6 md:p-8 font-mono text-sm md:text-[15px] leading-relaxed text-[#333] overflow-x-auto whitespace-pre-wrap selection:bg-black/10">
              {data.promptText}
            </div>
            {/* 复制按钮 */}
            <button 
              onClick={handleCopy}
              className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-sm border border-black/5 text-brand-muted hover:text-black opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
               {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </section>

        {/* 正文分块 */}
        <div className="space-y-16">
          {data.body.map((section: any, idx: number) => (
            <section key={idx}>
              <h2 className="text-3xl font-display mb-6">
                {section.heading}
              </h2>
              <div className="w-12 h-px bg-black/20 mb-6" />
              <p className="text-[17px] font-sans leading-[1.8] text-[#444]">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        {/* 底部 Footer */}
        <footer className="mt-32 pt-10 border-t border-black/10 text-center">
            <p className="text-sm font-sans text-brand-muted">
              End of Project Document.
            </p>
        </footer>
      </article>
    </motion.main>
  );
};

export default ProjectDetail;
