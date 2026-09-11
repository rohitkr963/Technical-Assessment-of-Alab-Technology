import { Check, X } from 'lucide-react';

export function Feedback({ error, notice, onDismissError }) {
  return (
    <>
      {error && (
        <div className="alert error">
          <X size={17} />
          {error}
          <button onClick={onDismissError} aria-label="Dismiss error"><X size={15} /></button>
        </div>
      )}
      {notice && <div className="alert success"><Check size={17} />{notice}</div>}
    </>
  );
}
