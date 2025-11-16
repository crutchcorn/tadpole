type UserMessageProps = {
  name: string;
  frog: string;
  hat: string;
  image: string;
}

export default function UserMessage({ name, frog, hat, image }: UserMessageProps) {
  return (
    <li className="mx-auto my-4 border-2 border-blue-800 flex gap-4 w-full bg-blue-500/30 backdrop-blur-lg rounded p-4">
      <div className="flex flex-col gap-2 items-center text-2xl font-bold">
        <span className="relative size-56 border-2 rounded p-2 border-green-800 pixelate backdrop-blur-lg">
          <img src={hat} className="absolute top-0 left-17 w-16" />
          <img src={frog} className="" />
        </span>
        <p>{name}</p>
      </div>
      <img src={image} className="bg-white max-w-full max-h-96" />
    </li>
  );
}
