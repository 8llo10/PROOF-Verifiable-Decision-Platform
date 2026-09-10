export function HashBlock({ hash }: { hash: string }) {
  return (
    <div className="hash-block">
      <div className="hash-label">SHA-256 EVIDENCE FINGERPRINT</div>
      <code>{hash}</code>
    </div>
  );
}
