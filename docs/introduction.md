![](./media/image331.png)

# Securing Webex with Identity Management, Zero Trust Encryption, and Data Compliance
<!-- Commented out for testing - config box moved to bottom of intro
<div id="lab-config-container"></div>
-->

This lab explores Webex security and educates attendees on the practical
steps required to enable and manage security features and functions
available with Webex deployments, including:

- Identity, Authentication (AuthN), and Authorization (AuthZ): Enable
  user provisioning and directory synchronization, explore settings and
  licensing templates, enable multi-factor authentication, and configure
  single sign-on (SSO) using SAML and OpenID Connect.

- End-to-End (E2E) Encryption: Examine Webex zero trust end-to-end encrypted meetings and calling, along with media watermarking, and deepfake integration with Webex.

- Compliance: Investigate compliance for Webex meetings and calling including eDiscovery with Theta Lake.


**Table of Contents**

- [About This Lab](#about-this-lab)
- [Requirements](#requirements)
- [Lab Details](#lab-details)
- [Topology](#topology)
- [Getting Started](#getting-started)
- [Module 1: Webex Identity and Authentication/Authorization with Duo](module1_identity.md#module-1-webex-identity-and-authenticationauthorization-with-duo)
    - [Sync Users from Active Directory to Duo](module1_identity.md#sync-users-from-active-directory-to-duo)
    - [Sync Users from Duo to Webex](module1_identity.md#sync-users-from-duo-to-webex)
    - [Webex Licensing and Settings Templates](module1_identity.md#webex-licensing-and-settings-templates)
    - [Configuring Duo to Use Active Directory for User Authentication](module1_identity.md#configuring-duo-to-use-active-directory-for-user-authentication)
    - [Single Sign-On with Webex and Duo (SAML and OIDC)](module1_identity.md#single-sign-on-with-webex-and-duo-saml-and-oidc)
        - [Duo SSO Setup (SAML)](module1_identity.md#duo-sso-setup-saml)
        - [Duo SSO Setup (OIDC)](module1_identity.md#duo-sso-setup-oidc)
    - [OpenID Connect -- Proof Key for Code Exchange (PKCE)](module1_identity.md#openid-connect-proof-key-for-code-exchange-pkce)
    - [Multiple Identity Providers with Webex](module1_identity.md#multiple-identity-providers-with-webex)
    - [Enable Multi-Factor Authentication (MFA) using Duo](module1_identity.md#enable-multi-factor-authentication-mfa-using-duo)
- [Module 2: Zero Trust End-to-End Encrypted Calling and Meetings, Media Watermarking, and Deepfake Detection](module2_zero_trust_encryption.md#module-2-zero-trust-end-to-end-encrypted-calling-and-meetings-media-watermarking-and-deepfake-detection)
    - [Schedule an End-to-End Encrypted Meeting](module2_zero_trust_encryption.md#schedule-an-end-to-end-encrypted-meeting)
    - [Features in an End-to-End Encrypted Meeting](module2_zero_trust_encryption.md#features-in-an-end-to-end-encrypted-meeting)
    - [Audio and Visual Watermarking and Watermark Analysis](module2_zero_trust_encryption.md#audio-and-visual-watermarking-and-watermark-analysis)
    - [Deepfake Detection with GetReal Labs and Webex](module2_zero_trust_encryption.md#deepfake-detection-with-getreal-labs-and-webex)
    - [Provision Users and Configure Zero Trust End-to-End Encrypted Calling](module2_zero_trust_encryption.md#provision-users-and-configure-zero-trust-end-to-end-encrypted-calling)
    - [Zero Trust End-to-End Encrypted Calling](module2_zero_trust_encryption.md#zero-trust-end-to-end-encrypted-calling)

- [Module 3: Webex Compliance with Webex and Theta Lake](module3_compliance.md#module-3-webex-compliance-with-webex-and-theta-lake)
    - [Webex Compliance and Preparing for Compliance Platform Integration](module3_compliance.md#webex-compliance-and-preparing-for-compliance-platform-integration)
    - [Explore eDiscovery for Webex Meetings in Theta Lake](module3_compliance.md#explore-ediscovery-for-webex-meetings-in-theta-lake)
    - [Explore eDiscovery for Webex Calling in Theta Lake](module3_compliance.md#explore-ediscovery-for-webex-calling-in-theta-lake)

- [Appendix](appendix.md#appendix)
    - [Explore Webex eDiscovery Search and Extraction Portal](appendix.md#explore-webex-ediscovery-search-and-extraction-portal)

---

## Lab Sections Quick Links
- **About This Lab** → [About This Lab](#about-this-lab)
- **Topology** → [Lab Topology](#topology)  
- **Getting Started** → [Getting Started](#getting-started)
- **Module 1** → [Webex Identity and Authentication/Authorization with Duo](module1_identity.md#module-1-webex-identity-and-authenticationauthorization-with-duo)
- **Module 2** → [Zero Trust End-to-End Encrypted Calling and Meetings, Media Watermarking, and Deepfake Detection](module2_zero_trust_encryption.md#module-2-zero-trust-end-to-end-encrypted-calling-and-meetings-media-watermarking-and-deepfake-detection)
- **Module 3** → [Webex Compliance with Webex and Theta Lake](module3_compliance.md#module-3-webex-compliance-with-webex-and-theta-lake)
- **Appendix** → [Explore Webex eDiscovery Search and Extraction Portal](appendix.md#appendix)

---

## About This Lab
Webex provides customers with a comprehensive set of security and
compliance capabilities across the Webex suite. This includes:

- On-premises or cloud corporate directory integration capabilities for
  managing Webex user identity and service provisioning.

- Support for standard-based Security Assertion Markup Language (SAML)
  and Open ID Connect (OIDC) authentication and authorization mechanisms
  with single sign-on (SSO) and multi-factor authentication.

- Built-in policy and compliance functionality as well as configurable
  integration(s) to third-party data loss prevention (DLP), eDiscovery,
  and Archival vendor solutions for messaging and meeting compliance.

- State of the art end-to-end encryption and verified identity
  capabilities for zero trust meetings on the encrypted in transit,
  encrypted at rest Webex architecture to ensure that customer data is
  always protected.

## Requirements
There are no requirements for this lab beyond the laptop provided and
this lab guide will walk you through the entire lab.

## Lab Details
This lab contains 3 modules:

- [Module 1: Webex Identity and Authentication/Authorization with Duo](module1_identity.md#module-1-webex-identity-and-authenticationauthorization-with-duo)

     This module explores Webex identity, provisioning, and
     authentication/authorization using Duo. This module explores SSO using
     SAML and OpenID Connect along with setting up multiple Identity
     Providers (IdP) in one organization.
     (Components: Active Directory, Webex Control Hub, Duo)

- [Module 2: Zero Trust End-to-End Encrypted Calling and Meetings, Media Watermarking, and Deepfake Detection](module2_zero_trust_encryption.md#module-2-zero-trust-end-to-end-encrypted-calling-and-meetings-media-watermarking-and-deepfake-detection)  
     This module exampines Webex zero trust end-to-end encrypted meetings and calling, along with media watermarking, and deepfake integration with Webex.
     (Components: Webex Control Hub, Webex App, GetReal Labs)

- [Module 3: Webex Compliance with Webex and Theta Lake](module3_compliance.md#module-3-webex-compliance-with-webex-and-theta-lake)
  
     This module investigates compliance for Webex meetings and calling including eDiscovery with Theta Lake. 
     (Components: Webex Control Hub, Webex App, Theta Lake)

Upon completion of all modules, participants will gain a good working
knowledge of the latest Webex security capabilities including identity
management and provisioning with SSO, using multiple IdPs, messaging and
meeting compliance with DLP/eDiscovery/Archive integrations, and zero
trust E2EE meetings with verified identity.

## Topology
This overall topology for this lab is shown in Figure 1 below. The
topology consists of:

- An on-premises network with Microsoft application server (e.g.,
  Microsoft Active Directory / Domain Name Service (DNS)).

- Three on-premises Windows Workstations with the Webex App serving as
  the software client used throughout this lab. These workstations are
  also used for all configuration as outlined in this guide.

- Dedicated Webex organization enabling the delivery of cloud
  collaboration services including meeting, messaging, and calling.

- Dedicated cloud service components for identity and compliance (Duo,
  Cisco Cloudlock, Theta Lake).

![Figure 1. Webex Security Lab
Topology](./media/image4.png)

This lab includes pre-configured users and components to facilitate the
lab scenarios covering the features and capabilities of Webex security.
Most components are fully configurable with predefined administrative
user accounts.

Refer to the Server and Application Credentials and
Details table (Table 1) below for application server IP
addresses and administration account credentials for accessing lab
components and performing the required configuration and operations.

Note: You may not use all the components listed in Table 1 for this lab.


## Server and Application Credentials
> **Note**: WW, XXX, YY, and ZZZZ in the credentials below are unique to your pod. Refer to your eXpo page for these values.

### Active Directory & DNS
- **Host Name**: ad1.dcloud.cisco.com
- **IP Address**: 198.18.133.1
- **Username**: administrator
- **Password**: dCloud123!
- **Description**: Windows Server 2012

### Workstation 1
- **Host Name**: wkst1.dcloud.cisco.com
- **IP Address**: 198.18.1.36
- **Windows Username**: cholland / dCloud123!
- **Webex App User**: cholland@cbXXX.dc-YY.com
      - SSO disabled: **dCloudZZZZ!**
      - SSO enabled: **dCloud123!**

### Workstation 2
- **Host Name**: wkst2.dcloud.cisco.com
- **IP Address**: 198.18.1.37
- **Windows Username**: aperez / dCloud123!
- **Webex App User**: aperez@cbXXX.dc-YY.com
      - SSO disabled: **dCloudZZZZ!**
      - SSO enabled: **dCloud123!**

### Workstation 3
- **Host Name**: wkst3.dcloud.cisco.com
- **IP Address**: 198.18.1.38
- **Windows Username**: kmelby / dCloud123!
- **Webex App User**: kmelby@cbXXX.dc-YY.com
      - SSO disabled: **dCloudZZZZ!**
      - SSO enabled: **dCloud123!**

### Webex Control Hub
- **URL**: https://admin.webex.com/
- **Users**: cholland@cbXXX.dc-YY.com, aperez@cbXXX.dc-YY.com
- **Password** (SSO disabled): **dCloudZZZZ!**
- **Password** (SSO enabled): **dCloud123!**

### Cisco Duo Admin Portal
- **URL**: https://admin-demodemo.duosecurity.com
- **Username**: cholland@cbXXX.dc-YY.com
- **Password**: dCloud12345!

### Cisco Cloudlock
- **URL**: https://demo.cloudlockng.com/
- **Username**: aperez@cbXXX.dc-YY.com
- **Password** (SSO disabled): **dCloudZZZZ!**
- **Password** (SSO enabled): **dCloud123!**

### Theta Lake
- **URL**: https://useast.thetalake.ai/
- **Username**: aperez@cbXXX.dc-YY.com
- **Password**: dCloud123!

---
## Getting Started
Follow the steps below to connect to your lab pod before proceeding with
Module 1.

1. From your workstation, navigate to the eXpo URL in Chrome.

    Link to eXpo: <https://expo.ciscodcloud.com/cr0ngam62v4rg3x7mljrz0tb3>
    
    Click **Explore**, enter your email address and accept the disclaimer.
    On the eXpo page, you will see two important tabs, **Network** and
    **Details**. To connect to your VMs, you will navigate to the
    **Network** tab and click the **Remote Desktop** link for the VM that
    the lab guide instructs you to access.
    
    ![](./media/image5.png)

1. You can find the last 4 digits of your unique **Session ID** on the
    eXpo page. This is needed when authenticating to Webex prior to
    enabling SSO. You will also need the domain that is unique to your
    dCloud session. This can be found by clicking **Details** \> **DNS
    Address** on your eXpo page.

      ![](./media/image6.png)

1. In addition to connecting to the AD server and workstations via web
    RDP for endpoint operations, you will use a web browser and other
    applications on the workstations (as indicated in this lab guide) to
    perform all operations and configuration.

In this lab, you will primarily utilize the following VMs:

- Active Directory: ad1.dcloud.cisco.com
- Workstation 1: wkst1.dcloud.cisco.com
- Workstation 2: wkst2.dcloud.cisco.com
- Workstation 3: wkst3.dcloud.cisco.com

---

## Configure Your Lab Values

Now that you have your eXpo page open and can see your unique pod values, enter them below. This will automatically replace the placeholders (cbXXX, dc-YY.com, dCloudZZZZ!) throughout the entire lab guide.

<div id="lab-config-container"></div>