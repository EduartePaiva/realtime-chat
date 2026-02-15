import { Image, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useChatStore } from "../store/use-chat-store";

export default function MessageInput() {
	const [text, setText] = useState("");
	const [imagePreviewObjURL, setImagePreviewObjURL] = useState<string | null>(
		null,
	);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isSendingMessage, setIsSendingMessage] = useState(false);
	const { sendMessage } = useChatStore();

	const handleImagePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		const files = e.clipboardData.files;
		if (files.length == 0) return;
		if (files.length > 1) {
			toast.error("Can't paste more than one image");
			return;
		}
		const file = files[0];
		if (!file.type.startsWith("image/")) {
			toast.error("Can't send a file that is not an image");
			return;
		}

		handleImageRead(file);
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || e.target.files.length === 0) return;
		const file = e.target.files[0];

		if (!file.type.startsWith("image/")) {
			toast.error("Please select an image file");
			return;
		}

		handleImageRead(file);
	};

	const handleImageRead = (image: File) => {
		setImageFile(image);

		if (imagePreviewObjURL) {
			URL.revokeObjectURL(imagePreviewObjURL);
		}
		const objURL = URL.createObjectURL(image);
		setImagePreviewObjURL(objURL);
	};

	const removeImage = () => {
		setImagePreviewObjURL(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!text.trim() && !imageFile) return;
		try {
			setIsSendingMessage(true);
			await sendMessage({
				text: text.trim(),
				image: imageFile,
			});

			// Clear form
			if (imagePreviewObjURL) URL.revokeObjectURL(imagePreviewObjURL);
			if (fileInputRef.current) fileInputRef.current.value = "";
			setText("");
			setImageFile(null);
			setImagePreviewObjURL(null);
		} catch (error) {
			console.error("Failed to send message:", error);
		} finally {
			setIsSendingMessage(false);
		}
	};

	return (
		<div className="p-4 w-full">
			{imagePreviewObjURL && (
				<div className="mb-3 flex items-center gap-2">
					<div className="relative">
						<img
							src={imagePreviewObjURL}
							alt="Preview"
							className="w-20 h-20 object-cover rounded-lg border border-base-300"
						/>

						<button
							onClick={removeImage}
							className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
							type="button"
							disabled={isSendingMessage}
						>
							<X className="size-3" />
						</button>
					</div>
				</div>
			)}

			<form onSubmit={handleSendMessage} className="flex items-center gap-2">
				<div className="flex-1 flex gap-2">
					<input
						type="text"
						className="w-full input input-bordered rounded-lg input-sm sm:input-md"
						placeholder="Type a message..."
						value={text}
						disabled={isSendingMessage}
						onChange={(e) => setText(e.target.value)}
						onPaste={handleImagePaste}
					/>
					<input
						type="file"
						accept="image/*"
						className="hidden"
						ref={fileInputRef}
						onChange={handleImageChange}
					/>
					<button
						type="button"
						className={`hidden sm:flex btn btn-circle ${
							imagePreviewObjURL ? "text-primary" : "text-base"
						}`}
						disabled={isSendingMessage}
						onClick={() => fileInputRef.current?.click()}
					>
						{isSendingMessage ? (
							<Loader2 size={20} className="animate-spin" />
						) : (
							<Image size={20} />
						)}
					</button>
				</div>
			</form>
		</div>
	);
}
