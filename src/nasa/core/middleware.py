from django.http.response import JsonResponse

from .exceptions import ApiError


class ApiErrorMiddleware(object):

    def process_exception(self, request, exception):
        """
        Catch ApiError and return json response with message
        """
        if isinstance(exception, ApiError):
            return JsonResponse({'message': exception.message}, status=exception.status_code)
        return None
