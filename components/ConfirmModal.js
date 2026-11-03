'use client';
export default function ConfirmModal({ open, title, message, confirmText = 'Confirm', danger, busy, onConfirm, onCancel }) {
  return (
    <dialog className={`modal ${open ? 'modal-open' : ''}`} onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal-box">
      <h3 className="font-display text-xl font-bold">{title}</h3>
      <p className="py-3 text-base-content/70">{message}</p>
        <div className="modal-action">
        <button className="btn btn-ghost" onClick={onCancel} disabled={busy}>Keep it</button>
        <button className={`btn ${danger ? 'btn-error' : 'btn-primary'}`} onClick={onConfirm} disabled={busy}>
        {busy && <span className="loading loading-spinner loading-sm" />}{confirmText}</button>
    </div>
    </div>
  </dialog>
  );
}
