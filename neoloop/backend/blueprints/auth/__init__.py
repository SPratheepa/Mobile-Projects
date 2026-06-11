def get_auth_service():

    from services.auth_service import AuthService

    return AuthService()


class _SvcProxy:

    def __init__(self, factory):

        self._factory = factory

    def __getattr__(
            self,
            name
    ):

        return getattr(
            self._factory(),
            name
        )


auth_service = _SvcProxy(
    get_auth_service
)