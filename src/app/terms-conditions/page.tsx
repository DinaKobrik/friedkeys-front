"use client";

import Text from "@/components/ui/Text";
import Heading from "@/components/ui/Heading";

export default function TermsConditions() {
  return (
    <main className="min-h-screen max-w-[1336px] mx-auto flex flex-col items-center justify-center mt-[24px] sm:mt-[80px]">
      <div className="mb-[32px] sm:mb-[80px]">
        <Heading variant="h1" className="mb-[32px] text-center">
          General Terms of Sale
        </Heading>
        <h2 className="text-white sm:text-center uppercase text-[14px] leading-[18px] sm:text-[24px] sm:leading-[24px]">
          ACCESS CODES FOR DIGITAL CONTENT - TERMS AND CONDITIONS OF SALE
        </h2>
      </div>

      <div className="flex flex-col gap-[24px] sm:gap-[40px] w-full">
        <Text>
          Please read the following important terms and conditions before you
          purchase any codes for digital games and/or content through this
          website.
        </Text>
        <div className="flex flex-col w-full gap-[24px]">
          <h3 className="text-white font-semibold text-[16px] leading-[18px] sm:text-[24px] sm:leading-[24px]">
            1. Who we are?
          </h3>
          <Text>
            {`1.1. These are the terms and conditions (“Terms”) upon which
            Aliasing DMCC, a private company incorporated under the laws of
            United Arab Emirates under company registration number DMCC179752
            and having its registered office at Office Unit 1204, Jumeirah
            Business Center 3, Cluster Y, Jumeirah Lakes Towers, Dubai, UAE
            (“FRIEDKEYS”, “we”, “us”, “our”) sell and supply access codes to
            digital content to you through the website www.name.com and through
            our mobile applications (“Website”).`}
          </Text>
          <Text>
            {`1.2. Our Website lists various digital content, e.g. downloadable
            game titles and other downloadable content (“Content”). We sell on
            the Website official keys, issued by the publisher and/or the
            developer of relevant Content (“Developer”), which allow the user to
            unlock, access and download the relevant Content from the
            Developer’s platform (“Code(s)”). We are not the Developer of the
            Content and we do not own or operate the Developer’s platform. In
            addition to these Terms, you may also be subject to the Developer’s
            end user licence agreement and other terms related to its Content
            and its platform.`}
          </Text>
        </div>
        <div className="flex flex-col w-full gap-[24px]">
          <h3 className="text-white font-semibold text-[16px] leading-[18px] sm:text-[24px] sm:leading-[24px]">
            2. Our Group Company
          </h3>
          <Text>
            {`2.1 One of our group companies, Transactial Limited, an Irish
            limited company with company number 664195, VAT number IE3684378BH
            and registered office at at Harcourt Center, Block 4, Harcourt Road,
            D02 HW77 Dublin Ireland (Irish Company) provides various services
            in conjunction with your purchase and redemption of Codes including
            the processing of your payments depending on the method of payment
            selected by you when purchasing Codes, customer services, technical
            support, managing of your cancellation rights and issuing you a
            refund or other payment where applicable.`}
          </Text>
        </div>
        <div className="flex flex-col w-full gap-[24px]">
          <h3 className="text-white font-semibold text-[16px] leading-[18px] sm:text-[24px] sm:leading-[24px]">
            3. How to contact us
          </h3>
          <Text>
            {`3.1. You can contact us through the support and ‘contact us’ links
            on the Website (https://www.name.com/en/support/) or by logging into
            your User Account (defined in section 4.1) and logging a customer
            support request or ticket or by writing to us at support@name.com.
            Irish Company manages customer services and technical support
            queries on behalf of Instant Gaming. 3.2. If we have to contact you
            we will do so by the email address you provided in your User Account
            settings.`}
          </Text>
        </div>
      </div>
    </main>
  );
}
