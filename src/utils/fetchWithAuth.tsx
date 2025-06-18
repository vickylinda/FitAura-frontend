import { useAuthModal } from "@/context/AuthModalContext";

export function useFetchWithAuth() {
  const { openModal } = useAuthModal();

  const fetchWithAuth = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    const token = localStorage.getItem("token");

    const authHeaders: Record<string, string> = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const finalOptions: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers && typeof options.headers === "object" && !(options.headers instanceof Headers)
          ? options.headers
          : {}),
        ...authHeaders,
      },
    };

    const response = await fetch(url, finalOptions);

    if (!response.ok) {
      try {
        const errorData = await response.clone().json();

        const isExpired = errorData.internalErrorCode === 1101;
        const isUnauth = errorData.internalErrorCode === 1100;

        if (isExpired || isUnauth) {
          openModal(isExpired ? "expired" : "unauthenticated");

          await new Promise<void>((resolve) => {
            const waitForLogin = async () => {
              const newToken = localStorage.getItem("token");
              if (newToken) {
                resolve();
              } else {
                setTimeout(waitForLogin, 500);
              }
            };
            waitForLogin();
          });

          const retryOptions: RequestInit = {
            ...options,
            headers: {
              "Content-Type": "application/json",
              ...(options.headers && typeof options.headers === "object" && !(options.headers instanceof Headers)
                ? options.headers
                : {}),
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          };

          return await fetch(url, retryOptions);
        }
      } catch {
        // no hacemos nada, devolvemos la response original
      }
    }

    return response;
  };

  return fetchWithAuth;
}
