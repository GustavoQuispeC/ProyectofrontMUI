interface Props {
  name: string;
}

export default function ProductPlaceholder({ name }: Props) {
  return (
    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
      <span className="text-xs text-slate-400">{name}</span>
    </div>
  );
}
