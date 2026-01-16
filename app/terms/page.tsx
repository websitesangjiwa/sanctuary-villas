import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | Sanctuary Villas",
  description: "Terms and conditions for Sanctuary Villas booking platform",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f5f3e8]">
      {/* Header */}
      <header className="bg-white border-b border-[#cab797]/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-[#643c15] hover:text-[#8b6630] transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="text-sm font-medium">Back to Home</span>
            </Link>

            <Link href="/" className="font-['Ovo'] text-xl text-[#2e1b12]">
              Sanctuary Villas
            </Link>

            <div className="w-24" />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-['Ovo'] text-3xl lg:text-4xl text-[#2e1b12] mb-8">
            Terms & Conditions
          </h1>

          <div className="prose prose-lg max-w-none text-[#643c15]">
            <p className="lead text-lg mb-8">
              Welcome to our booking platform!
            </p>

            <p className="mb-6">
              These terms and conditions outline the rules and regulations for the use of our platform.
            </p>

            <p className="mb-8">
              By accessing this platform we assume you accept these terms and conditions. Do not continue to use our platform if you do not agree to take all of the terms and conditions stated on this page.
            </p>

            <h2 className="font-['Ovo'] text-2xl text-[#2e1b12] mt-10 mb-4">
              Definitions
            </h2>
            <p className="mb-4">
              The following definitions applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements:
            </p>
            <ul className="list-disc pl-6 mb-8 space-y-2">
              <li>&quot;Client&quot;, &quot;You&quot; and &quot;Your&quot; refer to you, the person who logs onto this platform and is compliant to the property manager terms and conditions.</li>
              <li>&quot;The Property Manager&quot;, &quot;Ourselves&quot;, &quot;We&quot;, &quot;Our&quot; and &quot;Us&quot;, refers to the Property Manager of this platform.</li>
              <li>&quot;Party&quot;, &quot;Parties&quot;, or &quot;Us&quot;, refers to both the Client and the property manager.</li>
            </ul>

            <h2 className="font-['Ovo'] text-2xl text-[#2e1b12] mt-10 mb-4">
              Acknowledgment
            </h2>
            <p className="mb-4">
              These are the Terms and Conditions governing the use of this Service and the agreement that operates between you and the property manager. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
            </p>
            <p className="mb-4">
              Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.
            </p>
            <p className="mb-4">
              By accessing or using the Service you agree to be bound by these Terms and Conditions. If you disagree with any part of these Terms and Conditions then you may not access the Service.
            </p>
            <p className="mb-8">
              Your access to and use of the Service is also conditioned on your acceptance of and compliance with the Privacy Policy of the property manager. Our Privacy Policy describes our policies and procedures on the collection, use and disclosure of your personal information when you use the platform or the website and tells you about your privacy rights and how the law protects you. Please read our Privacy Policy carefully before using our Service.
            </p>

            <h2 className="font-['Ovo'] text-2xl text-[#2e1b12] mt-10 mb-4">
              Links to Other Websites
            </h2>
            <p className="mb-4">
              Our Service may contain links to third-party web sites or services that are not owned or controlled by the property manager.
            </p>
            <p className="mb-4">
              The property manager has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that the property manager shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such web sites or services.
            </p>
            <p className="mb-8">
              We strongly advise you to read the terms and conditions and privacy policies of any third-party web sites or services that you visit.
            </p>

            <h2 className="font-['Ovo'] text-2xl text-[#2e1b12] mt-10 mb-4">
              Termination
            </h2>
            <p className="mb-4">
              We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms and Conditions.
            </p>
            <p className="mb-8">
              Upon termination, your right to use the Service will cease immediately.
            </p>

            <h2 className="font-['Ovo'] text-2xl text-[#2e1b12] mt-10 mb-4">
              Limitation of Liability
            </h2>
            <p className="mb-4">
              Notwithstanding any damages that you might incur, the entire liability of the property manager and any of its suppliers under any provision of these Terms and your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by you through the Service.
            </p>
            <p className="mb-8">
              To the maximum extent permitted by applicable law, in no event shall the property manager or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service, third-party software and/or third-party hardware used with the Service, or otherwise in connection with any provision of these Terms), even if the property manager or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose.
            </p>

            <h2 className="font-['Ovo'] text-2xl text-[#2e1b12] mt-10 mb-4">
              &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; Disclaimer
            </h2>
            <p className="mb-4">
              The Service is provided to you &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the property manager, on its own behalf and on behalf of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service, including all implied warranties of merchantability, fitness for a particular purpose, title and non-infringement, and warranties that may arise out of course of dealing, course of performance, usage or trade practice.
            </p>
            <p className="mb-4">
              Without limitation to the foregoing, the property manager provides no warranty or undertaking, and makes no representation of any kind that the Service will meet your requirements, achieve any intended results, be compatible or work with any other software, applications, systems or services, operate without interruption, meet any performance or reliability standards or be error free or that any errors or defects can or will be corrected.
            </p>
            <p className="mb-8">
              Some jurisdictions do not allow the exclusion of certain types of warranties or limitations on applicable statutory rights of a consumer, so some or all of the above exclusions and limitations may not apply to you. But in such a case the exclusions and limitations set forth in this section shall be applied to the greatest extent enforceable under applicable law.
            </p>

            <h2 className="font-['Ovo'] text-2xl text-[#2e1b12] mt-10 mb-4">
              Governing Law
            </h2>
            <p className="mb-8">
              The laws of the Country, excluding its conflicts of law rules, shall govern these Terms and your use of the Service. Your use of the platform may also be subject to other local, state, national, or international laws.
            </p>

            <h2 className="font-['Ovo'] text-2xl text-[#2e1b12] mt-10 mb-4">
              Disputes Resolution
            </h2>
            <p className="mb-8">
              If you have any concern or dispute about the Service, you agree to first try to resolve the dispute informally by contacting the property manager.
            </p>

            <h2 className="font-['Ovo'] text-2xl text-[#2e1b12] mt-10 mb-4">
              Severability
            </h2>
            <p className="mb-8">
              If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.
            </p>

            <h2 className="font-['Ovo'] text-2xl text-[#2e1b12] mt-10 mb-4">
              Waiver
            </h2>
            <p className="mb-8">
              Except as provided herein, the failure to exercise a right or to require performance of an obligation under these Terms shall not effect a party&apos;s ability to exercise such right or require such performance at any time thereafter nor shall be the waiver of a breach constitute a waiver of any subsequent breach.
            </p>

            <h2 className="font-['Ovo'] text-2xl text-[#2e1b12] mt-10 mb-4">
              Changes to These Terms and Conditions
            </h2>
            <p className="mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will make reasonable efforts to provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            <p className="mb-8">
              By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, in whole or in part, please stop using the website and the Service.
            </p>

            <h2 className="font-['Ovo'] text-2xl text-[#2e1b12] mt-10 mb-4">
              Contact Us
            </h2>
            <p className="mb-4">
              If you have any questions about these Terms and Conditions, you can contact us:
            </p>
            <p className="mb-8">
              <a
                href="mailto:hi@andersolsson.me"
                className="text-[#8b6630] hover:underline"
              >
                hi@andersolsson.me
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
