using FluentValidation;
using Logic.Exceptions;
using Logic.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Text;

namespace NotesBack.Filters;

public class ExceptionFilter(ILogger<ExceptionFilter> logger) : IAsyncExceptionFilter
{
    public async Task OnExceptionAsync(ExceptionContext context)
    {
        logger.LogError(context.Exception, "Error");
        var error = GenerateError(context.Exception);
        context.HttpContext.Response.StatusCode = error.StatusCode;
        context.Result = new ObjectResult(error);
    }

    private static ErrorResponseDto GenerateError(Exception e)
    {
        return e switch
        {
            ValidationException ve => GenerateValidationError(ve),
            EmailNotConfirmedException ence => GenerateEmailNotConfirmedError(ence),
            _ => GenerateDefaultError(e),
        };
    }

    private static ErrorResponseDto GenerateValidationError(ValidationException ve)
    {
        var sb = new StringBuilder();
        foreach (var error in ve.Errors)
            sb.AppendLine(error.ErrorMessage);

        return new ErrorResponseDto
        {
            StatusCode = StatusCodes.Status500InternalServerError,
            ErrorMessage = sb.ToString()
        };
    }

    private static ErrorResponseDto GenerateEmailNotConfirmedError(EmailNotConfirmedException ence)
    {
        return new ErrorResponseDto
        {
            StatusCode = 420,
            ErrorMessage = ence.Message
        };
    }

    private static ErrorResponseDto GenerateDefaultError(Exception e)
    {
        return new ErrorResponseDto
        {
            StatusCode = StatusCodes.Status500InternalServerError,
            ErrorMessage = e.Message
        };
    }
}
