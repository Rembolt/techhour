import Image from "next/image";
import { Project } from "@/types/project";
import placeholderImage from "@/../public/images/project_placeholder.png";

const MAX_VISIBLE_TAGS = 3;

function formatCreatedAt(createdAt: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(createdAt);
}

function isRemoteImage(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

function getHoverStatusLine(project: Project) {
  const { projectStatus, isSeekingCollaborators, collaborationAvailability } =
    project;

  if (!isSeekingCollaborators) {
    return `${projectStatus} | not seeking collaborators`;
  }

  if (collaborationAvailability) {
    return `${projectStatus} | ${collaborationAvailability} collaborators needed`;
  }

  return `${projectStatus} | seeking collaborators`;
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={`h-3.5 w-3.5 drop-shadow-sm ${
        filled ? "fill-amber-300" : "fill-white/35"
      }`}
    >
      <path d="M10 1.5 12.7 7l6.05.55-4.6 3.95 1.4 5.9L10 14.6 4.45 17.4l1.4-5.9L1.25 7.55 7.3 7 10 1.5Z" />
    </svg>
  );
}

function DifficultyStars({ difficulty }: { difficulty: Project["difficulty"] }) {
  return (
    <p
      className="flex items-center gap-0.5"
      aria-label={`Difficulty ${difficulty} out of 5`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon key={index} filled={index < difficulty} />
      ))}
    </p>
  );
}

function CollaborationIndicator({ seeking }: { seeking: boolean }) {
  const label = seeking
    ? "Seeking collaborators"
    : "Not seeking collaborators";

  return (
    <span
      title={label}
      aria-label={label}
      className={`flex h-7 w-7 items-center justify-center shadow-sm ${
        seeking ? "bg-emerald-500 text-white" : "bg-zinc-500/80 text-white"
      }`}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M8.5 7.5a2.75 2.75 0 1 1 5.5 0 2.75 2.75 0 0 1-5.5 0Zm8.25 1.25a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM4.2 16.1c.86-2.2 3.1-3.6 5.55-3.6h1.5c2.45 0 4.7 1.4 5.55 3.6.22.57-.2 1.15-.8 1.15H5c-.6 0-1.02-.58-.8-1.15Zm10.7-.35c-.2-.7-.55-1.33-1.02-1.88 1.7.18 3.2 1.1 3.86 2.5.2.44-.12.88-.6.88h-2.05a.76.76 0 0 1-.19-.03Z" />
      </svg>
    </span>
  );
}

export default function ProjectCard({ project }: { project: Project }) {
  const {
    title,
    image,
    description,
    creator,
    tags,
    difficulty,
    isSeekingCollaborators,
    createdAt,
  } = project;
  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS);
  const imageSrc = image || placeholderImage;

  return (
    <article
      tabIndex={0}
      aria-label={title}
      className="group w-full max-w-[18.5rem] cursor-pointer outline-none"
    >
      <div className="flex h-8 w-[58%] items-end bg-[#f0cf6c] pl-3 pr-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] [clip-path:polygon(0_0,calc(100%-1.5rem)_0,100%_100%,0_100%)]">
        <h2 className="truncate pb-1 text-sm font-semibold tracking-tight text-[#3d2a0a]">
          {title}
        </h2>
      </div>

      <div className="relative -mt-px bg-[#f0cf6c] p-2 shadow-[0_10px_24px_rgba(80,50,0,0.16)] group-focus-visible:ring-2 group-focus-visible:ring-[#3d2a0a]/35">
        <div className="relative aspect-[5/4] overflow-hidden bg-[#fff6df]">
          <div className="absolute inset-0 transition-opacity duration-200 group-hover:opacity-0 group-focus-within:opacity-0 motion-reduce:transition-none">
            <Image
              src={imageSrc}
              alt={`Screenshot of ${title}`}
              fill
              unoptimized={typeof imageSrc === "string" && isRemoteImage(imageSrc)}
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 40vw, 296px"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-black/55 to-transparent p-2.5">
              <div
                className={`flex w-full items-center ${
                  isSeekingCollaborators ? "justify-between" : "justify-end"
                }`}
              >
                {isSeekingCollaborators ? (
                  <DifficultyStars difficulty={difficulty} />
                ) : null}
                <CollaborationIndicator seeking={isSeekingCollaborators} />
              </div>
            </div>
          </div>

          <div
            tabIndex={0}
            className="absolute inset-0 overflow-x-hidden overflow-y-auto overscroll-contain bg-[#fff8e8] p-2.5 text-[#3d2a0a] opacity-0 outline-none transition-opacity duration-200 [scrollbar-color:#7a6030_transparent] [scrollbar-width:thin] group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none"
          >
            <p className="text-sm font-semibold leading-5 break-words">{title}</p>
            <p className="mt-1 text-sm leading-5 break-words">{description}</p>
            <div className="mt-2 space-y-1">
              <p className="text-xs leading-4 break-words text-[#7a6030]">{creator}</p>
              <time
                dateTime={createdAt.toISOString()}
                className="block text-xs leading-4 break-words text-[#7a6030]"
              >
                {formatCreatedAt(createdAt)}
              </time>
              <p className="text-xs font-medium leading-4 break-words text-amber-700">
                {getHoverStatusLine(project)}
              </p>
              {visibleTags.length > 0 ? (
                <ul className="flex flex-wrap gap-1.5">
                  {visibleTags.map((tag) => (
                    <li
                      key={tag}
                      className="bg-[#f0cf6c]/70 px-2 py-0.5 text-[0.65rem] font-medium text-[#3d2a0a]"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
