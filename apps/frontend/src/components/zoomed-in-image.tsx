import { X } from "lucide-react";

type ZoomedInImageProps = {
	src: string;
	modalRef: React.RefObject<HTMLDialogElement | null>;
};

export default function ZoomedInImage({ src, modalRef }: ZoomedInImageProps) {
	return (
		<dialog ref={modalRef} className="modal">
			<div className="modal-box flex flex-col gap-4 ">
				<form method="dialog">
					{/* if there is a button in form, it will close the modal */}
					<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
						<X className="h-5 w-5" />
					</button>
				</form>
				{src && <img src={src} alt="zoomed in image" />}
			</div>
			<form method="dialog" className="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
	);
}
