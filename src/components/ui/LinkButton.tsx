import { LinkItem, ThemeStyles } from '../../types/database';

interface LinkButtonProps {
  link: LinkItem;
  themeStyles: ThemeStyles;
  onClick?: () => void;
  isPreview?: boolean;
}

export function LinkButton({ link, themeStyles, onClick, isPreview = false }: LinkButtonProps) {
  const isInternal = link.url.startsWith('#page-');
  const animClass = link.animation !== 'none' ? `anim-${link.animation}${link.animation === 'glow' ? ' anim-glow' : ''}` : '';

  const baseClass = isPreview
    ? `w-full py-3.5 px-4 rounded-xl flex items-center justify-between text-left transition-all duration-300 font-semibold text-xs ${themeStyles.card} ${animClass} cursor-pointer`
    : `w-full py-4 px-5 rounded-2xl flex items-center justify-between text-left transition-all duration-300 font-semibold text-sm ${themeStyles.card} ${animClass} relative shadow-sm cursor-pointer`;

  if (isInternal) {
    return (
      <button onClick={onClick} className={baseClass}>
        <span className="flex items-center gap-3 truncate">
          <i className={`fas ${link.icon || 'fa-link'} shrink-0 ${isPreview ? 'text-sm' : 'text-lg'} opacity-90`}></i>
          <span className="truncate pr-2">{link.title}</span>
        </span>
        <span className="opacity-75 text-xs shrink-0"><i className="fas fa-chevron-right"></i></span>
      </button>
    );
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={baseClass}
    >
      <span className="flex items-center gap-3 truncate">
        <i className={`fas ${link.icon || 'fa-link'} shrink-0 ${isPreview ? 'text-sm' : 'text-lg'} opacity-90`}></i>
        <span className="truncate pr-2">{link.title}</span>
      </span>
      <span className="opacity-75 text-xs shrink-0"><i className="fas fa-chevron-right"></i></span>
    </a>
  );
}
