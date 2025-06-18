export default function Image({ className, src }) {
  return <img className={className} src={`src/assets/img/${src}`} />;
}
