"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  caption?: string;
  date?: string;
  image?: string;
};

export function Lightbox({
  open,
  onClose,
  title,
  caption,
  date,
  image,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    dialog.addEventListener("cancel", onCancel);
    return () => dialog.removeEventListener("cancel", onCancel);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className={cn(
        "fixed inset-0 m-0 max-h-none max-w-none border-0 bg-transparent p-0 backdrop:bg-charcoal/70 backdrop:backdrop-blur-sm",
        "open:flex open:items-center open:justify-center",
      )}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="relative mx-4 w-full max-w-4xl overflow-hidden rounded-[2rem] bg-ivory shadow-2xl">
        {image ? (
          <div className="relative flex max-h-[72vh] w-full items-center justify-center bg-ivory-deep">
            <Image
              src={image}
              alt={title}
              width={1400}
              height={900}
              className="h-auto max-h-[72vh] w-full object-contain"
              sizes="(max-width: 900px) 100vw, 900px"
            />
          </div>
        ) : null}
        <div className="flex flex-wrap items-end justify-between gap-4 p-6 md:p-8">
          <div>
            {date ? (
              <p className="mb-2 text-xs tracking-[0.18em] text-burgundy-pale">
                {date}
              </p>
            ) : null}
            <h3 id={titleId} className="font-editorial text-2xl md:text-3xl">
              {title}
            </h3>
            {caption ? (
              <p className="mt-2 max-w-xl text-sm text-charcoal-soft">
                {caption}
              </p>
            ) : null}
          </div>
          <Button variant="ghost" onClick={onClose} aria-label="დახურვა">
            დახურვა
          </Button>
        </div>
      </div>
    </dialog>
  );
}
