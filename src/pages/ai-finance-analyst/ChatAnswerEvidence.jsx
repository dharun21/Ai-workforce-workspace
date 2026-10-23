function cleanText(value) {
  return String(value ?? "");
}

export default function ChatAnswerEvidence({ metadata }) {
  if (!metadata) return null;
  const figures = Array.isArray(metadata.supporting_figures) ? metadata.supporting_figures : [];
  const documents = Array.isArray(metadata.supporting_documents) ? metadata.supporting_documents : [];
  const assumptions = Array.isArray(metadata.assumptions) ? metadata.assumptions : [];
  const sources = (Array.isArray(metadata.sources) ? metadata.sources : [])
    .filter((source) => source?.title && /^https:\/\//i.test(source.url || ""));
  if (!figures.length && !documents.length && !assumptions.length && !sources.length) return null;

  return <div className="mt-3 space-y-2 border-t border-white/10 pt-3 text-[10px] leading-4 text-[#aaa5b8]">
    {figures.length > 0 && <div><strong className="text-[#d3cfdd]">Figures used</strong><ul className="mb-0 mt-1 space-y-1 pl-4">{figures.map((item, index) => <li key={`${item.label}-${index}`}><span className="text-[#e2deeb]">{cleanText(item.label)}: {cleanText(item.value)}</span>{item.source && <span className="block text-[#898496]">{cleanText(item.source)}</span>}</li>)}</ul></div>}
    {documents.length > 0 && <div><strong className="text-[#d3cfdd]">Documents</strong><ul className="mb-0 mt-1 pl-4">{documents.map((item, index) => <li key={item.id || index}>{cleanText(item.original_name || item.name || "Source document")}</li>)}</ul></div>}
    {sources.length > 0 && <div><strong className="text-[#d3cfdd]">Sources</strong><div className="mt-1 flex flex-wrap gap-2">{sources.map((source, index) => <a key={`${source.url}-${index}`} href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full rounded-full border border-violet-300/20 px-2.5 py-1.5 text-violet-200 hover:border-violet-300/50">{cleanText(source.title)}{source.date ? ` (${cleanText(source.date)})` : ""} ↗</a>)}</div></div>}
    {assumptions.length > 0 && <div><strong className="text-[#d3cfdd]">Assumptions and limits</strong><ul className="mb-0 mt-1 space-y-1 pl-4">{assumptions.map((item, index) => <li key={`${item}-${index}`}>{cleanText(item)}</li>)}</ul></div>}
  </div>;
}
