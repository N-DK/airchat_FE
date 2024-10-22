import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';

export default function PrivacyModal() {
    const [isOpen, setIsOpen] = useState(
        localStorage.getItem('notification_policy') ? false : true,
    );
    const userTheme = useSelector((state) => state.userTheme);
    const { theme } = userTheme;
    function closeModal() {
        setIsOpen(false);
        localStorage.setItem('notification_policy', false);
    }

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel
                                    className={`w-full max-w-3xl transform overflow-hidden rounded-2xl  p-6 text-left align-middle shadow-xl transition-all ${
                                        theme == 'dark'
                                            ? 'bg-darkPrimary'
                                            : 'bg-white'
                                    }`}
                                >
                                    <DialogTitle
                                        as="h3"
                                        className={`text-lg font-medium leading-6 text-gray-900 ${
                                            theme == 'dark' ? 'text-white' : ''
                                        }`}
                                    >
                                        Privacy Policy
                                    </DialogTitle>
                                    <div className="mt-2">
                                        <div
                                            className={`jsx-2456622248 ${
                                                theme == 'dark'
                                                    ? 'text-white'
                                                    : ''
                                            }`}
                                        >
                                            <div className="jsx-2456622248 legal-page">
                                                <div className="jsx-2456622248 legal-page__logo-wrapper">
                                                    <div>
                                                        <a
                                                            href="/"
                                                            previewlistener="true"
                                                        >
                                                            <img
                                                                src="https://izma.transtechvietnam.com/src/assets/talkie-logo.png?t=1725358084782"
                                                                alt="Talkie logo"
                                                                style={{
                                                                    height: '10em',
                                                                }}
                                                            />
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="jsx-2456622248 legal-page__content-container">
                                                    <h1 className="jsx-2456622248 legal-page__heading">
                                                        Privacy Policy
                                                    </h1>
                                                    <h2 className="jsx-2456622248 legal-page__sub-heading">
                                                        Effective date: April 1,
                                                        2024
                                                    </h2>
                                                    <p className="jsx-2456622248">
                                                        Protecting your private
                                                        information is our
                                                        priority.
                                                    </p>
                                                    <p className="jsx-2456622248">
                                                        This Privacy Policy
                                                        governs data collection
                                                        and usage. For the
                                                        purposes of this Privacy
                                                        Policy, unless otherwise
                                                        noted, all references to
                                                        Talkie, include Talkie’s
                                                        website(s) including
                                                        without limitation,
                                                        Talkie and any mobile
                                                        applications, including
                                                        without limitation,
                                                        Talkie (collectively the
                                                        “Site”) and Talkie
                                                        Incorporated, its
                                                        subsidiaries and
                                                        affiliates (“Talkie”,
                                                        “We” or “Us”).
                                                    </p>
                                                    <p className="jsx-2456622248">
                                                        The terms “You” or
                                                        “Your” refer to You, the
                                                        user(s) of the Site,
                                                        regardless of whether
                                                        you are a sole natural
                                                        person, using the Site
                                                        jointly with another
                                                        person or people, or an
                                                        entity.
                                                    </p>
                                                    <p className="jsx-2456622248">
                                                        Talkie is a messaging
                                                        and chat platform (the
                                                        “Services”). For the
                                                        purposes of these Terms,
                                                        Services shall be
                                                        defined broadly, and
                                                        include other services
                                                        provided by Talkie in
                                                        the future.
                                                    </p>
                                                    <p className="jsx-2456622248">
                                                        Talkie's Terms of Use
                                                        found at{' '}
                                                        <a
                                                            href="https://talkie.transtechvietnam.com/privacy"
                                                            className="jsx-2456622248"
                                                            previewlistener="true"
                                                        >
                                                            talkie.transtechvietnam.com/privacy
                                                        </a>
                                                        are hereby incorporated
                                                        in this Privacy Policy.
                                                        If you access the Site
                                                        via a mobile
                                                        application, you also
                                                        agree to our EULA found
                                                        at{' '}
                                                        <a
                                                            href="#"
                                                            className="jsx-2456622248"
                                                        >
                                                            talkie.transtechvietnam.com
                                                        </a>
                                                        .
                                                    </p>
                                                    <h3 className="jsx-2456622248 legal-page__sub-heading">
                                                        Collection of your
                                                        Personal Information
                                                    </h3>
                                                    <p className="jsx-2456622248">
                                                        Talkie may collect
                                                        personal information,
                                                        about you, including but
                                                        not limited to your:
                                                    </p>
                                                    <ul className="jsx-2456622248">
                                                        <li className="jsx-2456622248">
                                                            Full Name
                                                        </li>
                                                        <li className="jsx-2456622248">
                                                            Contact information
                                                            (e.g., email,
                                                            address, phone
                                                            number)
                                                        </li>
                                                        <li className="jsx-2456622248">
                                                            Information about
                                                            your devices (e.g.,
                                                            ISP information)
                                                        </li>
                                                        <li className="jsx-2456622248">
                                                            Credit Card/Payment
                                                            Information for
                                                            processing by a
                                                            third-party.
                                                        </li>
                                                        <li className="jsx-2456622248">
                                                            Any other
                                                            information you
                                                            voluntarily provide
                                                            to us including but
                                                            not limited to
                                                            information which
                                                            you provide while
                                                            registering on the
                                                            Site, including but
                                                            not limited to
                                                            information about
                                                            your personal
                                                            identity such as
                                                            name, location,
                                                            preferences, content
                                                            you put on the Site
                                                            if you use the
                                                            Services, etc.
                                                        </li>
                                                    </ul>
                                                    <p></p>
                                                    <p className="jsx-2456622248">
                                                        We do not collect any
                                                        personal information
                                                        about you unless you
                                                        voluntarily provide it
                                                        to us. However, you may
                                                        be required to provide
                                                        certain personal
                                                        information to us when
                                                        you elect to use the
                                                        Services available on
                                                        the Site. These may
                                                        include: (a) registering
                                                        for an account on our
                                                        Site; (b) entering
                                                        information for a link
                                                        sponsored by us or one
                                                        of our partners; (c)
                                                        signing up for special
                                                        offers from selected
                                                        third parties; (d)
                                                        sending us an email
                                                        message; (e) submitting
                                                        your credit card or
                                                        other payment
                                                        information for payment
                                                        processing by a
                                                        third-party (e.g.,
                                                        Stripe, etc.). Talkie
                                                        will use your
                                                        information for, but not
                                                        limited to,
                                                        communicating with you
                                                        in relation to your use
                                                        of the Services. We also
                                                        may gather additional
                                                        personal or non-personal
                                                        information in the
                                                        future.
                                                    </p>
                                                    <h3 className="jsx-2456622248 legal-page__sub-heading">
                                                        Sharing Information
                                                    </h3>
                                                    <p className="jsx-2456622248">
                                                        Talkie may share data
                                                        with trusted partners to
                                                        help perform statistical
                                                        analysis, send you email
                                                        or postal mail, provide
                                                        customer support, or
                                                        optimize your use of the
                                                        Services and learn more
                                                        about using a variety of
                                                        tools including but not
                                                        limited to artificial
                                                        intelligence and machine
                                                        learning applications we
                                                        may use in our sole
                                                        discretion. All third
                                                        parties are prohibited
                                                        from using your personal
                                                        information except to
                                                        provide these services
                                                        to Talkie, and we will
                                                        make reasonable efforts
                                                        to ensure they are
                                                        required to maintain the
                                                        confidentiality of your
                                                        information.
                                                    </p>
                                                    <p className="jsx-2456622248">
                                                        Talkie may disclose
                                                        potentially personal
                                                        information and
                                                        personally identifying
                                                        information to its
                                                        employees, contractors,
                                                        and affiliated
                                                        organizations that (i)
                                                        need to know that
                                                        information in order to
                                                        process it on Talkie’s
                                                        behalf or to provide
                                                        services available on
                                                        the Site and (ii) that
                                                        have agreed to the best
                                                        our knowledge not to
                                                        disclose it to others.
                                                        Some of those employees,
                                                        contractors and
                                                        affiliated organizations
                                                        may be located outside
                                                        of your home country or
                                                        jurisdiction; by using
                                                        the Site, you consent to
                                                        the transfer of such
                                                        information to them.
                                                    </p>
                                                    <p className="jsx-2456622248">
                                                        Talkie may disclose your
                                                        personal information,
                                                        without notice, if
                                                        required to do so by law
                                                        or in the good faith
                                                        belief that such action
                                                        is necessary to: (a)
                                                        conform to the edicts of
                                                        the law or comply with
                                                        legal process served on
                                                        Talkie or the site; (b)
                                                        protect and defend the
                                                        rights or property of
                                                        Talkie; and/or (c) act
                                                        under exigent
                                                        circumstances to protect
                                                        the personal safety of
                                                        users of Talkie, or the
                                                        public.
                                                    </p>
                                                    <h3 className="jsx-2456622248 legal-page__sub-heading">
                                                        Tracking User Behavior
                                                    </h3>
                                                    <p className="jsx-2456622248">
                                                        Talkie may at its sole
                                                        discretion keep track of
                                                        the websites and pages
                                                        our users visit within
                                                        Talkie whether by
                                                        desktop or mobile
                                                        device, in order to
                                                        determine what Talkie
                                                        services are the most
                                                        popular. This data is
                                                        used to deliver
                                                        customized content and
                                                        advertising within
                                                        Talkie to customers
                                                        whose behavior indicates
                                                        that they are interested
                                                        in a particular subject
                                                        area.
                                                    </p>
                                                    <h3 className="jsx-2456622248 legal-page__sub-heading">
                                                        Automatically Collected
                                                        Information
                                                    </h3>
                                                    <p className="jsx-2456622248">
                                                        Information about your
                                                        computer hardware and
                                                        software may be
                                                        automatically collected
                                                        by Talkie. This
                                                        information can include:
                                                        your IP address, browser
                                                        type, domain names,
                                                        access times and
                                                        referring website
                                                        addresses. This
                                                        information is used for
                                                        the operation of the
                                                        service, to maintain
                                                        quality of the service,
                                                        and to provide general
                                                        statistics regarding use
                                                        of the Site.
                                                    </p>
                                                    <h3 className="jsx-2456622248 legal-page__sub-heading">
                                                        Use of Cookies
                                                    </h3>
                                                    <p className="jsx-2456622248">
                                                        The Talkie website may
                                                        use "cookies" to help
                                                        you personalize your
                                                        online experience. A
                                                        cookie is a text file
                                                        that is placed on your
                                                        hard disk by a web page
                                                        server. Cookies cannot
                                                        be used to run programs
                                                        or deliver viruses to
                                                        your computer. Cookies
                                                        are uniquely assigned to
                                                        you and can only be read
                                                        by a web server in the
                                                        domain that issued the
                                                        cookie to you.
                                                    </p>
                                                    <p className="jsx-2456622248">
                                                        One of the primary
                                                        purposes of cookies is
                                                        to provide a convenience
                                                        feature to save you
                                                        time. The purpose of a
                                                        cookie is to tell the
                                                        Web server that you have
                                                        returned to a specific
                                                        page. For example, if
                                                        you personalize Talkie
                                                        pages, or register with
                                                        Talkie or use of the
                                                        Services, a cookie helps
                                                        Talkie to recall your
                                                        specific information on
                                                        subsequent visits. This
                                                        simplifies the process
                                                        of recording your
                                                        personal information,
                                                        such as billing
                                                        addresses, shipping
                                                        addresses, and so on.
                                                        When you return to the
                                                        Site, the information
                                                        you previously provided
                                                        can be retrieved, so you
                                                        can easily use the
                                                        Talkie features that you
                                                        customized.
                                                    </p>
                                                    <p className="jsx-2456622248">
                                                        You have the ability to
                                                        accept or decline
                                                        cookies. Most Web
                                                        browsers automatically
                                                        accept cookies, but you
                                                        can usually modify your
                                                        browser setting to
                                                        decline cookies if you
                                                        prefer. If you choose to
                                                        decline cookies, you may
                                                        not be able to fully
                                                        experience the
                                                        interactive features of
                                                        the Site or the
                                                        Services.
                                                    </p>
                                                    <h3 className="jsx-2456622248 legal-page__sub-heading">
                                                        Web Beacons
                                                    </h3>
                                                    <p className="jsx-2456622248">
                                                        Talkie may also use a
                                                        technology called web
                                                        beacons to collect
                                                        general information
                                                        about your use of our
                                                        website and your use of
                                                        special promotions or
                                                        newsletters. The
                                                        information we collect
                                                        by web beacons allows us
                                                        to statistically monitor
                                                        the number of people who
                                                        open our emails. Web
                                                        beacons also help us to
                                                        understand the behavior
                                                        of our customers,
                                                        members, and visitors.
                                                    </p>
                                                    <h3 className="jsx-2456622248 legal-page__sub-heading">
                                                        Business Transfers
                                                    </h3>
                                                    <p className="jsx-2456622248">
                                                        If Talkie, undergoes a
                                                        Change of Control (as
                                                        defined herein) your
                                                        personal information may
                                                        become an asset of such
                                                        a transaction. You
                                                        acknowledge that such
                                                        transfers may occur, and
                                                        that any acquirer of
                                                        Talkie may continue to
                                                        use your personal
                                                        information as set forth
                                                        in this policy. As used
                                                        herein, “Change of
                                                        Control” means (i) a
                                                        consolidation or merger
                                                        of Talkie with or into
                                                        any other corporation or
                                                        other entity or person,
                                                        or any other corporate
                                                        reorganization, other
                                                        than any such
                                                        consolidation, merger or
                                                        reorganization in which
                                                        the shares of capital
                                                        stock of Talkie
                                                        immediately prior to
                                                        such consolidation,
                                                        merger or
                                                        reorganization, continue
                                                        to represent a majority
                                                        of the voting power of
                                                        the surviving entity
                                                        immediately after such
                                                        consolidation, merger or
                                                        reorganization; (ii) any
                                                        transaction or series of
                                                        related transactions to
                                                        which Talkie is a party
                                                        in which in excess of
                                                        50% of Talkie’s voting
                                                        power is transferred; or
                                                        (iii) the sale or
                                                        transfer of all or
                                                        substantially all of the
                                                        Talkie’s assets, or the
                                                        exclusive license of all
                                                        or substantially all of
                                                        Talkie’s material
                                                        intellectual property;
                                                        provided that a Change
                                                        of Control shall not
                                                        include any transaction
                                                        or series of
                                                        transactions principally
                                                        for bona fide equity
                                                        financing purposes in
                                                        which cash is received
                                                        by Talkie or any
                                                        successor, indebtedness
                                                        of Talkie is cancelled,
                                                        or converted or a
                                                        combination thereof.
                                                    </p>
                                                    <h3 className="jsx-2456622248 legal-page__sub-heading">
                                                        Links
                                                    </h3>
                                                    <p className="jsx-2456622248">
                                                        The Site may contain
                                                        links to other
                                                        third-party sites.
                                                        Please be aware that we
                                                        are not responsible for
                                                        the content or privacy
                                                        practices of such other
                                                        sites. We encourage our
                                                        users to be aware when
                                                        they leave our site and
                                                        to read the privacy
                                                        statements of any other
                                                        site that collects
                                                        personally identifiable
                                                        information.
                                                    </p>
                                                    <h3 className="jsx-2456622248 legal-page__sub-heading">
                                                        Security of your
                                                        Personal Information
                                                    </h3>
                                                    <p className="jsx-2456622248">
                                                        Talkie secures your
                                                        personal information
                                                        from unauthorized
                                                        access, use, or
                                                        disclosure. We use SSL
                                                        Protocol for this
                                                        purpose. When personal
                                                        information is
                                                        transmitted to other
                                                        websites, it is
                                                        protected through the
                                                        use of encryption, such
                                                        as the Secure Sockets
                                                        Layer (SSL) protocol.
                                                    </p>
                                                    <p className="jsx-2456622248">
                                                        We strive to take
                                                        appropriate security
                                                        measures to protect
                                                        against unauthorized
                                                        access to or alteration
                                                        of your personal
                                                        information.
                                                        Unfortunately, no data
                                                        transmission over the
                                                        Internet or any wireless
                                                        network can be
                                                        guaranteed to be 100%
                                                        secure. As a result,
                                                        while we strive to
                                                        protect your personal
                                                        information, you
                                                        acknowledge that: (a)
                                                        there are security and
                                                        privacy limitations
                                                        inherent to the Internet
                                                        which are beyond our
                                                        control; and (b)
                                                        security, integrity, and
                                                        privacy of any and all
                                                        information and data
                                                        exchanged between you
                                                        and us through this Site
                                                        cannot be guaranteed.
                                                    </p>
                                                    <h3 className="jsx-2456622248 legal-page__sub-heading">
                                                        Minors
                                                    </h3>
                                                    <p className="jsx-2456622248">
                                                        Talkie’s services are
                                                        not intended for—and are
                                                        not directed to—anyone
                                                        under 13. And that’s why
                                                        Talkie does not
                                                        knowingly collect
                                                        personal information
                                                        from anyone under 13.
                                                    </p>
                                                    <h3 className="jsx-2456622248 legal-page__sub-heading">
                                                        E-mail Communications
                                                    </h3>
                                                    <p className="jsx-2456622248">
                                                        From time to time, we
                                                        may contact you via
                                                        email for the purpose of
                                                        providing announcements,
                                                        promotional offers,
                                                        alerts, confirmations,
                                                        surveys, and/or other
                                                        general communication.
                                                        You may opt out of such
                                                        communication by
                                                        contacting us.
                                                    </p>
                                                    <h3 className="jsx-2456622248 legal-page__sub-heading">
                                                        External Data Storage
                                                        Sites
                                                    </h3>
                                                    <p className="jsx-2456622248">
                                                        We may store your data
                                                        on servers provided by
                                                        third party hosting
                                                        vendors with whom we
                                                        have contracted.
                                                    </p>
                                                    <h3 className="jsx-2456622248 legal-page__sub-heading">
                                                        GDPR and Designated
                                                        Countries Privacy Rights
                                                    </h3>
                                                    <p className="jsx-2456622248">
                                                        This Section only
                                                        applies to Users and
                                                        Customers of the
                                                        Services that are
                                                        located in the European
                                                        Economic Area, United
                                                        Kingdom and/or
                                                        Switzerland
                                                        (collectively, the
                                                        “Designated Countries”)
                                                        at the time of data
                                                        collection. We may ask
                                                        you to identify which
                                                        country you are located
                                                        in when you use some of
                                                        the Services, or we may
                                                        rely on your IP address
                                                        to identify which
                                                        country you are located
                                                        in. Where we rely only
                                                        on your IP address, we
                                                        cannot apply the terms
                                                        of this Section to any
                                                        User or Customer that
                                                        masks or otherwise
                                                        obfuscates their
                                                        location information so
                                                        as not to appear located
                                                        in the Designated
                                                        Countries. If any terms
                                                        in this Section conflict
                                                        with other terms
                                                        contained in this
                                                        Policy, the terms in
                                                        this Section shall apply
                                                        to Users and Customers
                                                        in the Designated
                                                        Countries.
                                                    </p>
                                                    <p className="jsx-2456622248">
                                                        Talkie is a data
                                                        controller with regard
                                                        to any personal
                                                        information collected
                                                        from customers or users
                                                        of its Services. A “data
                                                        controller” is an entity
                                                        that determines the
                                                        purposes for which and
                                                        the manner in which any
                                                        personal information is
                                                        processed. Any third
                                                        parties that act as our
                                                        service providers are
                                                        “data processors” that
                                                        handle your personal
                                                        information in
                                                        accordance with our
                                                        instructions.
                                                    </p>
                                                    <p className="jsx-2456622248">
                                                        You may object to our
                                                        processing at any time
                                                        and as permitted by
                                                        applicable law if we
                                                        process your personal
                                                        information on the legal
                                                        basis of consent,
                                                        contract, or legitimate
                                                        interests. We can
                                                        continue to process your
                                                        personal information if
                                                        it is necessary for the
                                                        defense of legal claims,
                                                        or for any other
                                                        exceptions permitted by
                                                        applicable law.
                                                    </p>
                                                    <p className="jsx-2456622248">
                                                        If we process your
                                                        personal information
                                                        based on a contract with
                                                        you or based on your
                                                        consent, or the
                                                        processing is carried
                                                        out by automated means,
                                                        you may request to
                                                        receive your personal
                                                        information in a
                                                        structured, commonly
                                                        used, and
                                                        machine-readable format,
                                                        and to have us transfer
                                                        your personal
                                                        information directly to
                                                        another “controller”,
                                                        where technically
                                                        feasible, unless
                                                        exercise of this right
                                                        adversely affects the
                                                        rights and freedoms of
                                                        others.
                                                    </p>
                                                    <p className="jsx-2456622248">
                                                        If you believe Talkie
                                                        has infringed or
                                                        violated your privacy
                                                        rights, please contact
                                                        us so that we can work
                                                        to resolve your
                                                        concerns. You also have
                                                        a right to lodge a
                                                        complaint with a
                                                        competent supervisory
                                                        authority situated in a
                                                        Member State of your
                                                        habitual residence,
                                                        place of work, or place
                                                        of alleged infringement.
                                                    </p>
                                                    <h3 className="jsx-2456622248 legal-page__sub-heading">
                                                        California Consumer
                                                        Privacy Act of 2019
                                                        (CCPA)
                                                    </h3>
                                                    <p className="jsx-2456622248">
                                                        The CCPA provides
                                                        California residents
                                                        with specific rights
                                                        regarding their personal
                                                        information. This
                                                        section describes your
                                                        CCPA rights and explains
                                                        how to exercise those
                                                        rights. You have the
                                                        right to request that
                                                        Talkie disclose certain
                                                        information to you about
                                                        our collection and use
                                                        of your personal
                                                        information over the
                                                        past 12 months. Once we
                                                        receive and confirm your
                                                        verifiable consumer
                                                        request, we will
                                                        disclose to you:
                                                    </p>
                                                    <ul className="jsx-2456622248">
                                                        <li className="jsx-2456622248">
                                                            The categories of
                                                            personal information
                                                            we collected about
                                                            you.
                                                        </li>
                                                        <li className="jsx-2456622248">
                                                            The categories of
                                                            sources for the
                                                            personal information
                                                            we collected about
                                                            you.
                                                        </li>
                                                        <li className="jsx-2456622248">
                                                            Our business or
                                                            commercial purpose
                                                            for collecting or
                                                            selling that
                                                            personal
                                                            information.
                                                        </li>
                                                        <li className="jsx-2456622248">
                                                            The categories of
                                                            third parties with
                                                            whom we share that
                                                            personal
                                                            information.
                                                        </li>
                                                        <li className="jsx-2456622248">
                                                            The specific pieces
                                                            of personal
                                                            information we
                                                            collected about you
                                                            (also called a data
                                                            portability
                                                            request).
                                                        </li>
                                                    </ul>
                                                    <p></p>
                                                    <p className="jsx-2456622248">
                                                        If we sold or disclosed
                                                        your personal
                                                        information for a
                                                        business purpose, two
                                                        separate lists
                                                        disclosing:
                                                    </p>
                                                    <ul className="jsx-2456622248">
                                                        <li className="jsx-2456622248">
                                                            sales, identifying
                                                            the personal
                                                            information
                                                            categories that each
                                                            category of
                                                            recipient purchased;
                                                            and
                                                        </li>
                                                        <li className="jsx-2456622248">
                                                            disclosures for a
                                                            business purpose,
                                                            identifying the
                                                            personal information
                                                            categories that each
                                                            category of
                                                            recipient obtained.
                                                        </li>
                                                    </ul>
                                                    <p></p>
                                                    <h3 className="jsx-2456622248 legal-page__sub-heading">
                                                        CCPA Deletion Request
                                                        Rights
                                                    </h3>
                                                    <p className="jsx-2456622248">
                                                        You have the right to
                                                        request that we delete
                                                        any of your personal
                                                        information that we
                                                        collected from you and
                                                        retained, subject to
                                                        certain exceptions. Once
                                                        we receive and confirm
                                                        your verifiable consumer
                                                        request, we will delete
                                                        (and make reasonable
                                                        efforts to direct our
                                                        service providers to
                                                        delete) your personal
                                                        information from our
                                                        records, unless an
                                                        exception applies.
                                                    </p>
                                                    <p className="jsx-2456622248">
                                                        We may deny your
                                                        deletion request if
                                                        retaining the
                                                        information is necessary
                                                        for us or our service
                                                        provider(s) to:
                                                    </p>
                                                    <ul className="jsx-2456622248">
                                                        <li className="jsx-2456622248">
                                                            Complete the
                                                            transaction for
                                                            which we collected
                                                            the personal
                                                            information, provide
                                                            a good or service
                                                            that you requested,
                                                            take actions
                                                            reasonably
                                                            anticipated within
                                                            the context of our
                                                            ongoing business
                                                            relationship with
                                                            you, or otherwise
                                                            perform our contract
                                                            with you.
                                                        </li>
                                                        <li className="jsx-2456622248">
                                                            Detect security
                                                            incidents, protect
                                                            against malicious,
                                                            deceptive,
                                                            fraudulent, or
                                                            illegal activity, or
                                                            prosecute those
                                                            responsible for such
                                                            activities.
                                                        </li>
                                                        <li className="jsx-2456622248">
                                                            Debug products to
                                                            identify and repair
                                                            errors that impair
                                                            existing intended
                                                            functionality.
                                                        </li>
                                                        <li className="jsx-2456622248">
                                                            Exercise free
                                                            speech, ensure the
                                                            right of another
                                                            consumer to exercise
                                                            their free speech
                                                            rights, or exercise
                                                            another right
                                                            provided for by law.
                                                        </li>
                                                        <li className="jsx-2456622248">
                                                            Comply with the
                                                            California
                                                            Electronic
                                                            Communications
                                                            Privacy Act (Cal.
                                                            Penal Code § 1546
                                                            seq.).
                                                        </li>
                                                        <li className="jsx-2456622248">
                                                            Engage in public or
                                                            peer-reviewed
                                                            scientific,
                                                            historical, or
                                                            statistical research
                                                            in the public
                                                            interest that
                                                            adheres to all other
                                                            applicable ethics
                                                            and privacy laws,
                                                            when the
                                                            information’s
                                                            deletion may likely
                                                            render impossible or
                                                            seriously impair the
                                                            research’s
                                                            achievement, if you
                                                            previously provided
                                                            informed consent.
                                                        </li>
                                                        <li className="jsx-2456622248">
                                                            Enable solely
                                                            internal uses that
                                                            are reasonably
                                                            aligned with
                                                            consumer
                                                            expectations based
                                                            on your relationship
                                                            with us.
                                                        </li>
                                                        <li className="jsx-2456622248">
                                                            Comply with a legal
                                                            obligation.
                                                        </li>
                                                        <li className="jsx-2456622248">
                                                            Make other internal
                                                            and lawful uses of
                                                            that information
                                                            that are compatible
                                                            with the context in
                                                            which you provided
                                                            it.
                                                        </li>
                                                    </ul>
                                                    <p></p>
                                                    <p className="jsx-2456622248">
                                                        To exercise the access,
                                                        data portability, and
                                                        deletion rights
                                                        described above, please
                                                        submit a verifiable
                                                        consumer request to us
                                                        by either emailing us at
                                                        or sending a letter to
                                                        the contact information
                                                        below.
                                                    </p>
                                                    <p className="jsx-2456622248">
                                                        Only you, or a person
                                                        registered with the
                                                        California Secretary of
                                                        State that you authorize
                                                        to act on your behalf,
                                                        may make a verifiable
                                                        consumer request related
                                                        to your personal
                                                        information.
                                                    </p>
                                                    <p className="jsx-2456622248">
                                                        You may also make a
                                                        verifiable consumer
                                                        request on behalf of
                                                        your minor child. You
                                                        may only make a
                                                        verifiable consumer
                                                        request for access or
                                                        data portability twice
                                                        within a 12-month
                                                        period. The verifiable
                                                        consumer request must:
                                                    </p>
                                                    <ul className="jsx-2456622248">
                                                        <li className="jsx-2456622248">
                                                            Provide sufficient
                                                            information that
                                                            allows us to
                                                            reasonably verify
                                                            you are the person
                                                            about whom we
                                                            collected personal
                                                            information or an
                                                            authorized
                                                            representative.
                                                        </li>
                                                        <li className="jsx-2456622248">
                                                            Describe your
                                                            request with
                                                            sufficient detail
                                                            that allows us to
                                                            properly understand,
                                                            evaluate, and
                                                            respond to it.
                                                        </li>
                                                    </ul>
                                                    <p></p>
                                                    <p className="jsx-2456622248">
                                                        Talkie cannot respond to
                                                        your request or provide
                                                        you with personal
                                                        information if we cannot
                                                        verify your identity or
                                                        authority to make the
                                                        request and confirm the
                                                        personal information
                                                        relates to you.
                                                    </p>
                                                    <p className="jsx-2456622248">
                                                        Making a verifiable
                                                        consumer request does
                                                        not require you to
                                                        create an account with
                                                        us.
                                                    </p>
                                                    <p className="jsx-2456622248">
                                                        We will only use
                                                        personal information
                                                        provided in a verifiable
                                                        consumer request to
                                                        verify the requestor’s
                                                        identity or authority to
                                                        make the request.
                                                    </p>
                                                    <h3 className="jsx-2456622248 legal-page__sub-heading">
                                                        Amendments
                                                    </h3>
                                                    <p className="jsx-2456622248">
                                                        We reserve the right to
                                                        change this Privacy
                                                        Policy from time to
                                                        time. We will notify you
                                                        about significant
                                                        changes in the way we
                                                        treat personal
                                                        information by sending a
                                                        notice to the primary
                                                        email address specified
                                                        in your account, by
                                                        placing a prominent
                                                        notice on our site,
                                                        and/or by updating any
                                                        privacy information on
                                                        this page. Your
                                                        continued use of the
                                                        Site and/or Services
                                                        available through this
                                                        Site after such
                                                        modifications will
                                                        constitute your: (a)
                                                        acknowledgment of the
                                                        modified Privacy Policy;
                                                        and (b) agreement to
                                                        abide and be bound by
                                                        that Policy.
                                                    </p>
                                                    <h3 className="jsx-2456622248 legal-page__sub-heading">
                                                        Contact Information
                                                    </h3>
                                                    <p className="jsx-2456622248">
                                                        Talkie welcomes your
                                                        questions or comments
                                                        regarding this Privacy
                                                        Policy. If you believe
                                                        that Talkie has not
                                                        adhered to the protocols
                                                        herein, please contact
                                                        Talkie by email at
                                                        <a
                                                            href="mailto:support@taikie.com"
                                                            className="jsx-2456622248"
                                                        >
                                                            support@taikie.com
                                                        </a>
                                                    </p>
                                                </div>
                                            </div>
                                            <footer className="footer flex flex-col justify-center items-center mt-3">
                                                <div className="mb-1">
                                                    <a
                                                        className="mr-3"
                                                        href="/faq"
                                                        style={{
                                                            color: '#facc15',
                                                        }}
                                                        previewlistener="true"
                                                    >
                                                        FAQ
                                                    </a>
                                                    <a
                                                        href="/privacy"
                                                        style={{
                                                            color: '#facc15',
                                                        }}
                                                        previewlistener="true"
                                                    >
                                                        Privacy Policy
                                                    </a>
                                                </div>
                                                <p>© 2024 Talkie, Inc.</p>
                                            </footer>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="flex justify-end space-x-4">
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                onClick={closeModal}
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
