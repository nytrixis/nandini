import { cn } from "@/lib/utils";
import { IconLayoutNavbarCollapse, IconX } from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
  direction = "horizontal",
}: {
  items: { 
    title: string; 
    icon: React.ReactNode; 
    href?: string; 
    onClick?: () => void;
    onSecondaryClick?: () => void;
    isPermanent?: boolean;
    isMinimized?: boolean;
  }[];
  desktopClassName?: string;
  mobileClassName?: string;
  direction?: "horizontal" | "vertical";
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} direction={direction} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: { 
    title: string; 
    icon: React.ReactNode; 
    href?: string; 
    onClick?: () => void;
    onSecondaryClick?: () => void;
    isPermanent?: boolean;
    isMinimized?: boolean;
  }[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-3 flex flex-col gap-3"
          >
            {items.map((item, idx) => (
              <motion.div
                key={`${item.title}-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
                className="relative"
              >
                {item.href ? (
                  <a
                    href={item.href}
                    key={item.title}
                    className={cn(
                      "flex h-15 w-15 items-center justify-center rounded-full glass hover:bg-slate-700/50",
                      item.isMinimized && "border border-amber-400/30"
                    )}
                  >
                    <div className="h-6 w-6">{item.icon}</div>
                  </a>
                ) : (
                  <div className="relative">
                    <button
                      onClick={item.onClick}
                      key={item.title}
                      className={cn(
                        "flex h-15 w-15 items-center justify-center rounded-full glass hover:bg-slate-700/50",
                        item.isMinimized && "border border-amber-400/30"
                      )}
                    >
                      <div className="h-6 w-6">{item.icon}</div>
                    </button>
                    {item.isMinimized && item.onSecondaryClick && (
                      <button
                        onClick={item.onSecondaryClick}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center"
                      >
                        <IconX className="w-2 h-2 text-white" />
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-15 w-15 items-center justify-center rounded-full glass hover:bg-slate-700/50"
      >
        <IconLayoutNavbarCollapse className="h-8 w-8 text-slate-300" />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
  direction = "horizontal",
}: {
  items: { 
    title: string; 
    icon: React.ReactNode; 
    href?: string; 
    onClick?: () => void;
    onSecondaryClick?: () => void;
    isPermanent?: boolean;
    isMinimized?: boolean;
  }[];
  className?: string;
  direction?: "horizontal" | "vertical";
}) => {
  const mouseX = useMotionValue(Infinity);
  const mouseY = useMotionValue(Infinity);
  
  return (
    <motion.div
      onMouseMove={(e) => {
        if (direction === "horizontal") {
          mouseX.set(e.pageX);
        } else {
          mouseY.set(e.pageY);
        }
      }}
      onMouseLeave={() => {
        mouseX.set(Infinity);
        mouseY.set(Infinity);
      }}
      className={cn(
        direction === "horizontal" 
          ? "mx-auto hidden h-24 items-end gap-6 rounded-3xl glass px-6 pb-4 md:flex dock-glow"
          : "mx-auto hidden w-24 flex-col items-center gap-6 rounded-3xl glass py-6 px-4 md:flex dock-glow",
        className,
      )}
    >
      {items.map((item, index) => (
        <IconContainer 
          mouseX={mouseX} 
          mouseY={mouseY}
          key={`${item.title}-${index}`}
          direction={direction}
          {...item} 
        />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  mouseY,
  title,
  icon,
  href,
  onClick,
  onSecondaryClick,
  isMinimized,
  direction = "horizontal",
}: {
  mouseX: MotionValue;
  mouseY: MotionValue;
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  onSecondaryClick?: () => void;
  isMinimized?: boolean;
  direction?: "horizontal" | "vertical";
}) {
  const ref = useRef<HTMLDivElement>(null);
  
  const distance = useTransform(direction === "horizontal" ? mouseX : mouseY, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, y: 0, width: 0, height: 0 };
    return direction === "horizontal" 
      ? val - bounds.x - bounds.width / 2
      : val - bounds.y - bounds.height / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [60, 120, 60]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [60, 120, 60]);
  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [30, 60, 30]);
  const heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [30, 60, 30],
  );

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  const content = (
    <motion.div
      ref={ref}
      style={{ width, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex aspect-square items-center justify-center rounded-full glass hover:bg-slate-700/50",
        isMinimized && "border border-amber-400/30"
      )}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: direction === "vertical" ? 10 : 0, y: direction === "horizontal" ? 10 : 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              x: direction === "vertical" ? 0 : "-50%", 
              y: direction === "horizontal" ? 0 : "-50%",
              scale: 1
            }}
            exit={{ 
              opacity: 0, 
              x: direction === "vertical" ? 10 : "-50%", 
              y: direction === "horizontal" ? 2 : "-50%",
              scale: 0.9
            }}
            className={cn(
              "absolute w-fit rounded-lg glass px-4 py-3 text-base whitespace-pre text-slate-300 orbitron",
              direction === "vertical" 
                ? "left-full ml-4 top-1/2 -translate-y-1/2"
                : "-top-10 left-1/2 -translate-x-1/2"
            )}
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Close button for minimized tabs */}
      {isMinimized && onSecondaryClick && hovered && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={(e) => {
            e.stopPropagation();
            onSecondaryClick();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center z-10"
        >
          <IconX className="w-3 h-3 text-white" />
        </motion.button>
      )}

      <motion.div
        style={{ width: widthIcon, height: heightIcon }}
        className="flex items-center justify-center"
      >
        {icon}
      </motion.div>
    </motion.div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer">{content}</a>
  ) : (
    <button onClick={onClick}>{content}</button>
  );
}