import React from 'react';

export interface ProjectCardPreviewProps {
  title: string;
  image?: string;
  isEven: boolean;
}

export const ProjectCardPreview: React.FC<ProjectCardPreviewProps> = ({
  title,
  image,
  isEven,
}) => {
  return (
    <div className={`lg:col-span-7 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
      <div className="relative overflow-hidden rounded-2xl border border-[#d6cebf] bg-[#ece5d8] shadow-sm">
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[#d6cebf]/60 bg-[#f4eee5]/80">
          <span className="w-2.5 h-2.5 rounded-full bg-[#e3dacd] border border-[#d6cebf]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#e3dacd] border border-[#d6cebf]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#e3dacd] border border-[#d6cebf]" />
          <span className="text-[10px] font-mono text-[#78716c] ml-2 truncate">
            {title.toLowerCase().replace(/\s+/g, '-')}.app
          </span>
        </div>
        {image ? (
          <img
            src={image}
            alt={`Captura de pantalla de ${title}`}
            className="w-full aspect-[16/10] object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-[16/10] bg-[#e3dacd]/40 flex items-center justify-center font-mono text-xs text-[#78716c]">
            Vista previa
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCardPreview;
