<!-- BEGIN MICROSOFT SECURITY.MD V0.0.7 BLOCK -->

## Security

Microsoft takes the security of our software products and services seriously, which includes all source code repositories managed through our GitHub organizations, which include [Microsoft](https://github.com/Microsoft), [Azure](https://github.com/Azure), [DotNet](https://github.com/dotnet), [AspNet](https://github.com/aspnet), [Xamarin](https://github.com/xamarin), and [our GitHub organizations](https://opensource.microsoft.com/).

If you believe you have found a security vulnerability in any Microsoft-owned repository that meets [Microsoft's definition of a security vulnerability](https://aka.ms/opensource/security/definition), please report it to us as described below.

## Reporting Security Issues

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them to the Microsoft Security Response Center (MSRC) at [https://msrc.microsoft.com/create-report](https://aka.ms/opensource/security/create-report).

If you prefer to submit without logging in, send email to [secure@microsoft.com](mailto:secure@microsoft.com).  If possible, encrypt your message with our PGP key; please download it from the [Microsoft Security Response Center PGP Key page](https://aka.ms/opensource/security/pgpkey).

You should receive a response within 24 hours. If for some reason you do not, please follow up via email to ensure we received your original message. Additional information can be found at [microsoft.com/msrc](https://aka.ms/opensource/security/msrc). 

Please include the requested information listed below (as much as you can provide) to help us better understand the nature and scope of the possible issue:

  * Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
  * Full paths of source file(s) related to the manifestation of the issue
  * The location of the affected source code (tag/branch/commit or direct URL)
  * Any special configuration required to reproduce the issue
  * Step-by-step instructions to reproduce the issue
  * Proof-of-concept or exploit code (if possible)
  * Impact of the issue, including how an attacker might exploit the issue

This information will help us triage your report more quickly.

If you are reporting for a bug bounty, more complete reports can contribute to a higher bounty award. Please visit our [Microsoft Bug Bounty Program](https://aka.ms/opensource/security/bounty) page for more details about our active programs.

## Preferred Languages

We prefer all communications to be in English.

## Policy

Microsoft follows the principle of [Coordinated Vulnerability Disclosure](https://aka.ms/opensource/security/cvd).

<!-- END MICROSOFT SECURITY.MD BLOCK -->

## Node.js tooling security

Repository development, CI, builds, tests, documentation, and packaging use the
[October 21, 2026 Node.js security baseline](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases):
Node.js 22.23.4, 24.22.1, or 26.12.1, or a later stable release within one of those
major lines. Node.js CI pins 22.23.4 and 24.22.1; CodeQL uses managed default
scanning without the repository's custom query configuration.
The root `package.json` uses `devEngines` to check the runtime used by npm tooling
without adding an `engines` requirement to the published packages. Keep this
constraint and the workflow pins in sync when raising the baseline.

Updating Node.js addresses the applicable DNS, TLS, HTTP, crypto snapshot,
filesystem-permission, Brotli decoder, and Node.js 26 ZIP fixes, plus bundled
c-ares, CA certificate, OpenSSL, SQLite, and Undici updates where included in each
release line. It also hardens encoding-only tooling as a precaution, including
the Node.js zlib runtime used by compression dependencies and packaging tools
such as `npm pack`. CVE-2026-111497 affects Brotli **decoding**; this does not
classify encoding as vulnerable or change the library API or compression behavior.

The published library does not select or ship a Node.js runtime. Consumers must
update their own runtimes. GitHub-hosted runner images, JavaScript action runtimes
embedded in checkout/setup-node/CodeQL, and externally managed build agents or
pipeline tasks must be patched by their owners; `setup-node` selects the runtime
for subsequent shell commands, not those embedded runtimes. The shared
DynamicProto release pipeline is maintained in the separate 1DS repository and
must retain its own patched runtime selection and guard.
