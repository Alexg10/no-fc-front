export function ImageCaption({ caption }: { caption: string }) {
  return (
    <figcaption className="text-polymath text-center mt-5 lg:text-left">
      {caption}
    </figcaption>
  );
}
