import { useState } from "react";
import { useAuthStore } from "../store/use-auth-store";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import { Link } from "react-router";
import AuthImagePattern from "../components/auth-image-pattern";

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const { login, isLoggingIn } = useAuthStore();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		login(formData);
	};
	return (
		<div className="min-h-screen grid lg:grid-cols-2">
			{/* left side */}
			<div className="flex flex-col  items-center justify-center p-6 sm:p-12">
				<div className="w-full max-w-md space-y-8">
					{/* LOGO */}
					<div className="text-center mb-8">
						<div className="flex flex-col gap-2 items-center group">
							<div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
								<MessageSquare className="size-6 text-primary" />
							</div>
							<h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
							<p className="text-base-content/60">Sign in to your account</p>
						</div>
					</div>

					{/* FORM */}
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="form-control">
							<label className="label">
								<span className="label-text font-medium">Email</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
									<Mail className="size-5 text-base-content/60" />
								</div>
								<input
									type="email"
									className={`input input-bordered w-full pl-10`}
									placeholder="you@email.com"
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
								/>
							</div>
						</div>
						<div className="form-control">
							<label className="label">
								<span className="label-text font-medium">Password</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
									<Lock className="size-5 text-base-content/60" />
								</div>
								<input
									type={showPassword ? "text" : "password"}
									className={`input input-bordered w-full pl-10`}
									placeholder="........"
									value={formData.password}
									onChange={(e) => setFormData({ ...formData, password: e.target.value })}
								/>
								<button
									type="button"
									className="absolute insert-y-0 right-0 top-2.5 pr-3 flex items-center"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeOff className="size-5 text-base-content/40" />
									) : (
										<Eye className="size-5 text-base-content/40" />
									)}
								</button>
							</div>
						</div>

						<button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
							{isLoggingIn ? (
								<>
									<Loader2 className="size-5 animate-spin" />
									Loading...
								</>
							) : (
								"Sign in"
							)}
						</button>

						<div className="text-center">
							<p className="text-base-content/60">
								Don&apos;t have an account?{" "}
								<Link to="/signup" className="link link-primary">
									Create account
								</Link>
							</p>
						</div>
					</form>
				</div>
			</div>

			{/* right side */}
			<AuthImagePattern
				title="Join our community"
				subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
			/>
		</div>
	);
}
