import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy & Cookie Policy | Sanctuary Villas",
  description: "Privacy and cookie use policy for Sanctuary Villas booking platform",
};

export default function PrivacyPage() {
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
            Privacy & Cookie Use Policy
          </h1>

          <div className="prose prose-lg max-w-none text-[#643c15]">
            <p className="lead text-lg mb-8">
              Welcome to our booking platform (the &quot;Platform&quot; or &quot;We&quot;). The Platform allows guests or tenants to perform online booking or reservations of properties and rooms (the &quot;Service&quot;). This privacy policy (the &quot;Policy&quot;) outlines our privacy practices with respect to the Service, including the ways your personal information and data are collected, stored, used and shared.
            </p>

            <p className="mb-6">
              Providing us with your personal information is a choice you make. We appreciate that and thank you for making this choice. You are not legally obligated to provide us with this information, but We do need it to allow you to use the Service.
            </p>

            <p className="mb-8">
              We act as data controllers and are responsible for the collection and use of any data that you submit or provide through the Service. In addition to this privacy statement, we may have additional policies or codes of conduct which will apply in relation to your use of the Service. If you have any questions about your use of the Service, please contact us.
            </p>

            <h2 className="font-['Ovo'] text-2xl text-[#2e1b12] mt-10 mb-4">
              What kind of personal information is collected?
            </h2>
            <p className="mb-4">
              When you submit an inquiry, make a customer service request or register an account, you provide contact information such as your name, address, mobile phone number and email address.
            </p>
            <p className="mb-4">
              We may collect your credit card or debit card information when you pay for the Service. This information is collected on our behalf by a payment processor.
            </p>
            <p className="mb-8">
              We may use cookies and similar tracking technologies to collect information on our website, and via email. Additionally, We may collect your IP address from your internet service provider and may collect your bank details upon property owners&apos; need.
            </p>

            <h2 className="font-['Ovo'] text-2xl text-[#2e1b12] mt-10 mb-4">
              Use & Disclosure of collected information
            </h2>
            <p className="mb-4">
              We may share the information you shared with us with third party service providers in order to provide and support the Service:
            </p>
            <ul className="list-disc pl-6 mb-8 space-y-2">
              <li>Communicating with you regarding the use of the Service and respond to your requests</li>
              <li>Enhancing the security and safety of the Service, such as by investigating suspicious activity or violations of applicable terms or policies</li>
              <li>Developing new tools, products or services within the Service</li>
              <li>Associating activity on the Service across different devices operated by the same individual to improve the overall operation of the Service</li>
              <li>To identify and fix bugs that may be present</li>
              <li>Conducting data and system analytics, including research to improve the Service</li>
              <li>Comply with any applicable law and assisting law enforcement agencies and competent authorities, if We believe it is necessary or justified</li>
            </ul>

            <h2 className="font-['Ovo'] text-2xl text-[#2e1b12] mt-10 mb-4">
              Accessing, modifying, exporting or deleting your information
            </h2>
            <p className="mb-4">You have the following rights with respect to your personal data:</p>
            <ul className="list-disc pl-6 mb-8 space-y-2">
              <li>The right to request a copy of your personal data</li>
              <li>The right to request to correct your personal data if inaccurate or out of date</li>
              <li>The right to request that your personal data be deleted when it is no longer necessary to retain such data</li>
              <li>The right to withdraw any consent to personal data processing at any time. For example, your consent to receive e-marketing communications. If you want to withdraw your consent to e-marketing, please make use of the link to manage your subscriptions included in our communication. Please note that you may still receive system messages and administrative communications, such as order confirmation, system messages and notifications about your account activities</li>
              <li>The right to request to provide you with your personal data and, if possible, to pass on this information directly (in a portable format) to another data controller when the processing is based on consent or contract</li>
              <li>The right to request a restriction on further data processing, in case there is a dispute in relation to the accuracy or processing of your personal data</li>
              <li>The right to object to the processing of personal data, in case data processing has been based on legitimate interest and/or direct marketing</li>
            </ul>
            <p className="mb-8">
              If you are not able to do so using the tools provided in the Service, you should contact us directly for access, modification, export or deletion of your personal information.
            </p>

            <h2 className="font-['Ovo'] text-2xl text-[#2e1b12] mt-10 mb-4">
              GDPR Notice
            </h2>
            <p className="mb-4">
              The following disclosure is made pursuant to the European General Data Protection Regulation (GDPR):
            </p>
            <p className="mb-4">
              As a data controller of our clients&apos; personal data, we are committed to protecting and respecting your privacy in compliance with EU- General Data Protection Regulation (GDPR) 2016/679, dated April 27th 2016.
            </p>

            <h3 className="font-['Ovo'] text-xl text-[#2e1b12] mt-8 mb-3">
              Our legal basis for collecting personal data
            </h3>
            <p className="mb-4">
              <strong>Collecting personal data based on consents:</strong> The collection of personal data based on consent from the data subject will be done by using consent forms that will store documentation related to the consent given by the individual. We use personal information for fulfilling our obligations related to contracts and agreements with customers, partners and suppliers.
            </p>
            <p className="mb-8">
              <strong>Collecting personal data based on legitimate interest:</strong> We may use personal data if it is considered to be of legitimate interest, and if the privacy interests of the data subject do not override this interest. Normally, to establish the legal basis for data collection, an assessment has been made during which a mutual interest has been identified.
            </p>

            <h3 className="font-['Ovo'] text-xl text-[#2e1b12] mt-8 mb-3">
              Data Retention
            </h3>
            <p className="mb-8">
              We retain personally identifiable information for as long as we deem necessary for the purposes set forth above. We may delete information from our systems, without notice to you, once we deem it is no longer necessary for the purposes set forth above.
            </p>

            <h2 className="font-['Ovo'] text-2xl text-[#2e1b12] mt-10 mb-4">
              CCPA Notice
            </h2>
            <p className="mb-4">
              You may exercise certain consumer rights under the California Consumer Privacy Act (CCPA). Your CCPA rights are described below.
            </p>

            <h3 className="font-['Ovo'] text-xl text-[#2e1b12] mt-8 mb-3">
              Right to Know
            </h3>
            <p className="mb-4">
              You have the right to request information regarding the categories and specific pieces of personal information we have collected about you, as well as the sources of that information, the business purpose for collecting it, and what types of third parties we share or sell it with.
            </p>

            <h3 className="font-['Ovo'] text-xl text-[#2e1b12] mt-8 mb-3">
              Right to Deletion
            </h3>
            <p className="mb-4">
              You have the right to request that we delete any of your personal information. We will delete any personal information that is not critical to the normal business operation from our records and direct all of our service providers to do the same. We consider data to be critical to our business operation if they are used to:
            </p>
            <ul className="list-disc pl-6 mb-8 space-y-2">
              <li>Provide goods or services to you</li>
              <li>Detect and resolve issues related to security or functionality</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h3 className="font-['Ovo'] text-xl text-[#2e1b12] mt-8 mb-3">
              Right to Non-Discrimination
            </h3>
            <p className="mb-4">If you exercise your consumer rights:</p>
            <ul className="list-disc pl-6 mb-8 space-y-2">
              <li>We will not deny goods or services to you</li>
              <li>We will not charge different prices or rates for goods or services, including through the use of discounts or other benefits or imposing penalties</li>
              <li>We will not provide a different level or quality of goods or services to you</li>
            </ul>

            <h3 className="font-['Ovo'] text-xl text-[#2e1b12] mt-8 mb-3">
              Do Not Sell My Personal Information
            </h3>
            <p className="mb-8">
              We do not sell any information that identifies you, such as your name or contact information. However, we do allow Ad Networks such as Facebook and Google to collect your electronic activity while on our website.
            </p>

            <h2 className="font-['Ovo'] text-2xl text-[#2e1b12] mt-10 mb-4">
              Children&apos;s Privacy
            </h2>
            <p className="mb-8">
              This service is for people 16 years of age or older. We do not knowingly or intentionally collect information about children who are under 16 years of age.
            </p>

            <h2 className="font-['Ovo'] text-2xl text-[#2e1b12] mt-10 mb-4">
              Cookies
            </h2>
            <p className="mb-4">
              We may use cookies on the Service. Cookies are packets of information sent by our servers to your web browser and then sent back by the browser each time it accesses our servers. The cookies may contain a variety of information, such as the web pages you have accessed, session durations and IP addresses.
            </p>
            <p className="mb-4">
              Cookies are used for various purposes, such as to collect statistical information about your use of the Service and save you the need to re-login with your username and password when you use the Service. This information is used to make websites work more efficiently, as well as to provide business and marketing information, and to gather such personal data as browser type and operating system, referring page, path through site, domain of ISP, etc. for the purposes of understanding how visitors use a website.
            </p>
            <p className="mb-4">
              Cookies and similar technologies help us tailor our website to your personal needs, as well as to detect and prevent security threats and abuse.
            </p>
            <p className="mb-4">
              If you wish to block cookies, you may do so through your browser&apos;s settings or using the option in the service website for blocking marketing cookies. You can delete cookies that are already on your computer and you can set your browser to prevent them from being placed going forward. Please refer to the browser&apos;s help menu for further information. However, please bear in mind that disabling cookies may adversely affect your user experience on the Service.
            </p>
            <p className="mb-8">
              You can delete advertising cookies in your browser by using this form:{" "}
              <a
                href="https://optout.aboutads.info/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8b6630] hover:underline"
              >
                https://optout.aboutads.info/
              </a>
            </p>

            <h2 className="font-['Ovo'] text-2xl text-[#2e1b12] mt-10 mb-4">
              Changes to the Privacy Policy
            </h2>
            <p className="mb-4">
              We may change this Policy from time to time. We will provide you notice of such changes through the Services&apos; interface. Your continued use of the Service constitutes your consent to the amended Policy.
            </p>
            <p className="mb-8">
              If you do not consent to the amended Policy, We may terminate the Terms and your account on the Service and block your access to, and use of, the Service, upon the elapse of 30 days after you decline to accept the revised Policy. In the case of legal requirement or necessity, we may also introduce immediate changes to this Policy. The latest version of the Terms and its effective date will always be accessible on the Service.
            </p>

            <h2 className="font-['Ovo'] text-2xl text-[#2e1b12] mt-10 mb-4">
              Contact Us
            </h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us:
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
