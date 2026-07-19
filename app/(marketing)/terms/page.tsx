"use client";

import React from "react";

export default function TermsPage() {
	return (
		<main className="flex flex-col min-h-screen">
			<section className="bg-[#F8FAFC] pt-12 md:pt-20 pb-12 md:pb-16 flex-grow flex flex-col">
				<div className="mx-auto w-full max-w-[1280px] px-4 md:px-8 flex flex-col flex-grow">
					<h1 className="text-[23px] md:text-[40px] lg:text-[45px] font-bold text-black mb-16 font-nunito tracking-tight text-center">
						Terms of Service
					</h1>
					
					<div className="w-full bg-[#F8FAFC] pr-4 md:pr-8 overflow-y-auto max-h-[60vh] 
						[&::-webkit-scrollbar]:w-2.5 
						[&::-webkit-scrollbar-track]:bg-transparent 
						[&::-webkit-scrollbar-thumb]:bg-[#C6F2D6] 
						[&::-webkit-scrollbar-thumb]:rounded-full">
						
						<div className="text-[14px] md:text-[16px] text-black/80 font-nunito leading-relaxed space-y-8 text-left pb-8">
							<p>
								Welcome to OgaFlow.<br />
								These Terms of Service govern your access to and use of OgaFlow and its related services. By accessing or using the platform, you agree to be bound by these Terms.
							</p>

							<div>
								<h2 className="font-bold text-black mb-2">1. Acceptance of Terms</h2>
								<p>By creating an account or using OgaFlow, you confirm that you have read, understood, and agreed to these Terms.</p>
							</div>

							<div>
								<h2 className="font-bold text-black mb-2">2. About OgaFlow</h2>
								<p>OgaFlow is a cloud-based Employee Management System that enables organizations to manage employee records, departments, payroll, attendance, projects, customer management, invoicing, appraisals, surveys, recruitment, and other operational functions from a centralized platform.</p>
							</div>

							<div>
								<h2 className="font-bold text-black mb-2">3. User Accounts</h2>
								<p>Organizations are responsible for creating and managing employee accounts.<br />
								Users agree to:</p>
								<ol className="list-decimal pl-5 mt-2 space-y-1">
									<li>Provide accurate information.</li>
									<li>Keep login credentials secure.</li>
									<li>Notify their administrator of any unauthorized account access.</li>
									<li>Use the platform only for authorized business purposes.</li>
								</ol>
							</div>

							<div>
								<h2 className="font-bold text-black mb-2">4. User Responsibilities</h2>
								<p>Users agree not to:</p>
								<ol className="list-decimal pl-5 mt-2 space-y-1">
									<li>Misuse or interfere with the platform.</li>
									<li>Attempt unauthorized access to company or system data.</li>
									<li>Upload malicious software or harmful content.</li>
									<li>Share confidential company information without authorization.</li>
								</ol>
							</div>

							<div>
								<h2 className="font-bold text-black mb-2">5. Subscription & Billing</h2>
								<p>OgaFlow operates on a subscription-based model. Subscription plans determine the features and plugins available to each organization. Failure to maintain an active subscription may result in restricted access to certain services.</p>
							</div>

							<div>
								<h2 className="font-bold text-black mb-2">6. Intellectual Property</h2>
								<p>All software, content, branding, logos, and intellectual property relating to OgaFlow remain the property of OgaFlow unless otherwise stated. Organizations retain ownership of the data they upload to the platform.</p>
							</div>

							<div>
								<h2 className="font-bold text-black mb-2">7. Data Security</h2>
								<p>OgaFlow employs reasonable administrative and technical measures to safeguard company information. While we strive to protect your data, no online system can guarantee absolute security.</p>
							</div>

							<div>
								<h2 className="font-bold text-black mb-2">8. Service Availability</h2>
								<p>We aim to provide reliable service, but we do not guarantee uninterrupted availability. Maintenance, updates, or unforeseen technical issues may temporarily affect platform access.</p>
							</div>

							<div>
								<h2 className="font-bold text-black mb-2">9. Suspension or Termination</h2>
								<p>OgaFlow reserves the right to suspend or terminate accounts that violate these Terms or engage in activities that compromise the platform's security or integrity.</p>
							</div>

							<div>
								<h2 className="font-bold text-black mb-2">10. Limitation of Liability</h2>
								<p>OgaFlow shall not be liable for indirect, incidental, or consequential damages arising from the use or inability to use the platform, except where required by applicable law.</p>
							</div>

							<div>
								<h2 className="font-bold text-black mb-2">11. Changes to These Terms</h2>
								<p>We may update these Terms periodically. Continued use of OgaFlow after updates constitutes acceptance of the revised Terms.</p>
							</div>

							<div>
								<h2 className="font-bold text-black mb-2">12. Contact Us</h2>
								<p>For questions regarding these Terms, please contact our support team through the official OgaFlow support email.</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
