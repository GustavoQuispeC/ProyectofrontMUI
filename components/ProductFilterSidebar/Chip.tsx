interface Props {
  label: string;
}

export default function Chip({ label }: Props) {
  return <span className="px-3 py-1 rounded-full bg-slate-100 text-xs">{label}</span>;
}
