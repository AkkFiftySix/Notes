using System.Linq;
using System.Linq.Expressions;

namespace Logic.Extensions;
public static class HelperExtensions
{
    public static T ThrowIfNull<T>(this T value, Func<Exception> func) where T : class
    {
        if (value is Task)
            throw new InvalidOperationException($"{nameof(ThrowIfNull)}: value is Task");

        if (value is null)
            throw func();

        return value;
    }

    public static IQueryable<T> IfWhere<T>(this IQueryable<T> query, bool condition, Expression<Func<T, bool>> expr)
        where T : class
    {
        if (condition)
            return query.Where(expr);
        return query;
    }
}

