"use client";

import React from "react";

export default function PrivacyPage() {
	return (
		<main className="flex flex-col min-h-screen">
			<section className="bg-[#F8FAFC] pt-12 md:pt-20 pb-12 md:pb-16 flex-grow flex flex-col">
				<div className="mx-auto w-full max-w-[1280px] px-4 md:px-6 flex flex-col flex-grow">
					<h1 className="text-[23px] md:text-[40px] lg:text-[45px] font-bold text-black mb-16 font-nunito tracking-tight text-center">
						Privacy Policy
					</h1>
					
					<div className="w-full bg-[#F8FAFC] pr-4 md:pr-8 overflow-y-auto max-h-[60vh] 
						[&::-webkit-scrollbar]:w-2.5 
						[&::-webkit-scrollbar-track]:bg-transparent 
						[&::-webkit-scrollbar-thumb]:bg-[#C6F2D6] 
						[&::-webkit-scrollbar-thumb]:rounded-full">
						
						<div className="text-[14px] md:text-[16px] text-black/80 font-nunito leading-relaxed space-y-8 text-left pb-8">
							<p>
								At OgaFlow, we value your privacy and are committed to protecting the information entrusted to us.
							</p>

							<div>
								<h2 className="font-bold text-black mb-2">1. Information We Collect</h2>
								<p>Depending on how the platform is used, OgaFlow may collect:</p>
								<ol className="list-decimal pl-5 mt-2 space-y-1">
									<li>Personal information (name, email address, phone number).</li>
									<li>Employee records.</li>
									<li>Attendance records.</li>
									<li>Payroll-related information.</li>
									<li>Project and departmental information.</li>
									<li>Customer and invoice records.</li>
									<li>System usage and activity logs.</li>
								</ol>
							</div>

							<div>
								<h2 className="font-bold text-black mb-2">2. How We Use Your Information</h2>
								<p>We use the collected information to:</p>
								<ol className="list-decimal pl-5 mt-2 space-y-1">
									<li>Provide and maintain the OgaFlow platform.</li>
									<li>Manage employee and organizational records.</li>
									<li>Process payroll-related activities.</li>
									<li>Generate reports and analytics.</li>
									<li>Improve platform performance.</li>
									<li>Provide customer support.</li>
									<li>Enhance platform security.</li>
								</ol>
							</div>

							<div>
								<h2 className="font-bold text-black mb-2">3. Data Sharing</h2>
								<p>OgaFlow does not sell personal information.<br />
								Information may be shared only:</p>
								<ol className="list-decimal pl-5 mt-2 space-y-1">
									<li>With the organization that owns the account.</li>
									<li>When required by law.</li>
									<li>With trusted service providers that support platform operations under appropriate confidentiality obligations.</li>
								</ol>
							</div>

							<div>
								<h2 className="font-bold text-black mb-2">4. Data Security</h2>
								<p>We implement reasonable technical and organizational safeguards to protect your information against unauthorized access, loss, or misuse.</p>
							</div>

							<div>
								<h2 className="font-bold text-black mb-2">5. Data Retention</h2>
								<p>We retain organizational and employee data only for as long as necessary to provide our services or comply with legal obligations.</p>
							</div>

							<div>
								<h2 className="font-bold text-black mb-2">6. User Rights</h2>
								<p>Depending on applicable laws, users may have the right to:</p>
								<ol className="list-decimal pl-5 mt-2 space-y-1">
									<li>Access their personal information.</li>
									<li>Request corrections to inaccurate information.</li>
									<li>Request deletion where legally applicable.</li>
									<li>Withdraw consent where appropriate.</li>
								</ol>
								<p className="mt-2">Requests should be made through the user's organization or OgaFlow support.</p>
							</div>

							<div>
								<h2 className="font-bold text-black mb-2">7. Cookies & Analytics</h2>
								<p>OgaFlow may integrate with trusted third-party services such as cloud storage, email delivery, payment gateways, and analytics providers to support platform functionality.</p>
							</div>

							<div>
								<h2 className="font-bold text-black mb-2">9. Changes to This Privacy Policy</h2>
								<p>This Privacy Policy may be updated periodically. Any significant changes will be communicated through the platform or other appropriate channels.</p>
							</div>

							<div>
								<h2 className="font-bold text-black mb-2">10. Contact Us</h2>
								<p>If you have questions about this Privacy Policy or how your information is handled, please contact the OgaFlow support team via the official support email.</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
