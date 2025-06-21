// src/components/Toaster.tsx
"use client"

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react"

export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
})

export const showSuccessToast = (action: "crear" | "eliminar" | "publicar" | "despublicar") => {
  let title = ""
  let description = ""

  switch (action) {
    case "crear":
      title = "Servicio creado"
      description = "Tu servicio fue creado exitosamente."
      break
    case "eliminar":
      title = "Servicio eliminado"
      description = "El servicio fue eliminado correctamente."
      break
    case "publicar":
      title = "Servicio publicado"
      description = "Tu servicio ahora es visible para todos."
      break
    case "despublicar":
      title = "Servicio despublicado"
      description = "El servicio ya no está visible para otros usuarios."
      break
  }

  toaster.create({
    type: "success",
    title,
    description,
    closable: true,
  })
}

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => (
          <Toast.Root width={{ md: "sm" }}>
            {toast.type === "loading" ? (
              <Spinner size="sm" color="blue.500" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {toast.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}
