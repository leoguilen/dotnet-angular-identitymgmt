using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
using IdentityProvider.Domain.Entities;
using IdentityProvider.Infra.Configurations;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.FeatureManagement;

namespace IdentityProvider.Infra.Notifications;

internal sealed class EmailNotificationSender(
    IFeatureManager featureManager,
    IConfiguration configuration,
    IOptions<SmtpOptions> smtpOptions,
    ILogger<EmailNotificationSender> logger)
    : IEmailSender<User>
{
    private readonly Uri _frontendUri = new(configuration["CorsPolicy:Origins:0"]!);
    private readonly SmtpOptions _smtpOptions = smtpOptions.Value;

    public async Task SendConfirmationLinkAsync(
        User user,
        string email,
        string confirmationLink)
    {
        if (!await featureManager.IsEnabledAsync("EmailNotificationFeature"))
        {
            logger.LogInformation(
                "Sending confirmation link to {To} with link {Link}",
                email,
                confirmationLink);
            return;
        }

        var confirmationLinkUri = new Uri(confirmationLink);
        var newConfirmationLink = new UriBuilder(_frontendUri)
        {
            Path = "/auth/confirmation-email",
            Query = confirmationLinkUri.Query[1..],
        };

        await SendEmailAsync(
            email: email,
            subject: "Confirm your account",
            body: $@"
                <p>Click the link below to confirm your email address.</p>
                <a href=""{newConfirmationLink.Uri}"" style=""text-decoration: none;"">Confirm your email</a>");
    }

    public async Task SendPasswordResetCodeAsync(
        User user,
        string email,
        string resetCode)
    {
        if (!await featureManager.IsEnabledAsync("EmailNotificationFeature"))
        {
            logger.LogInformation(
                "Sending password reset code to {To} with code {Code}",
                email,
                resetCode);
            return;
        }

        var passwordResetLink = new UriBuilder(_frontendUri)
        {
            Path = "/auth/password-reset",
            Query = $"code={resetCode}",
        };

        await SendEmailAsync(
            email: email,
            subject: "Reset your password",
            body: $@"
                <p>Click the link below to reset your password.</p>
                <a href=""{passwordResetLink.Uri}"" style=""text-decoration: none;"">Reset your password</a>");
    }

    public async Task SendPasswordResetLinkAsync(
        User user,
        string email,
        string resetLink)
    {
        if (!await featureManager.IsEnabledAsync("EmailNotificationFeature"))
        {
            logger.LogInformation(
                "Sending password reset link to {To} with link {Link}",
                email,
                resetLink);
            return;
        }

        var resetLinkUri = new Uri(resetLink);
        var newResetLink = new UriBuilder(_frontendUri)
        {
            Path = "/auth/password-reset",
            Query = resetLinkUri.Query[1..],
        };

        await SendEmailAsync(
            email: email,
            subject: "Reset your password",
            body: $@"
                <p>Click the link below to reset your password.</p>
                <a href=""{newResetLink.Uri}"" style=""text-decoration: none;"">Reset your password</a>");
    }

    private async Task SendEmailAsync(
        string email,
        string subject,
        string body)
    {
        try
        {
            using var client = new SmtpClient(_smtpOptions.Host, _smtpOptions.Port)
            {
                Credentials = _smtpOptions.UseCredentials
                    ? new NetworkCredential(_smtpOptions.UserName, _smtpOptions.Password)
                    : null,
                DeliveryMethod = SmtpDeliveryMethod.Network,
            };

            var message = new MailMessage(
                from: _smtpOptions.From,
                to: email,
                subject: subject,
                body: body)
            {
                IsBodyHtml = true,
                BodyEncoding = Encoding.UTF8,
                BodyTransferEncoding = TransferEncoding.Base64,
                Sender = new MailAddress(_smtpOptions.From),
            };

            await client.SendMailAsync(message);

            if (logger.IsEnabled(LogLevel.Debug))
            {
                logger.LogDebug("Email sent to {Email} with content {Content}", email, message.Body);
            }
        }
        catch (SmtpException ex)
        {
            logger.LogError(ex, "Error sending email");
            throw;
        }
    }
}
