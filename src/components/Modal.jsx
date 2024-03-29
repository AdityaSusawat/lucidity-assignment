//A generic Modal. Can be modified for different use cases

export default function Modal({ show, onClose, children }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-[#292B27] p-8 rounded-xl relative">
        <button
          className="bg-[#272826] text-[#DEFF55] absolute top-8 right-4 text-xl w-12 h-12 border-[#323332] border-[3px]"
          onClick={onClose}
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
}
