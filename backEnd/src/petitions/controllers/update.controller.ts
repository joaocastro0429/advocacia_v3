import { Response } from "express"
import { PetitionStatus, PetitionType } from "@prisma/client"
import { AuthenticatedRequest } from "../../login/middlewares/auth.middleware.js"
import { UpdatePetition } from "../services/update.service.js"

const coercePetitionType = (value: unknown): PetitionType | undefined => {
  if (typeof value !== "string") return undefined
  return (Object.values(PetitionType) as string[]).includes(value)
    ? (value as PetitionType)
    : undefined
}

const coercePetitionStatus = (value: unknown): PetitionStatus | undefined => {
  if (typeof value !== "string") return undefined
  return (Object.values(PetitionStatus) as string[]).includes(value)
    ? (value as PetitionStatus)
    : undefined
}

export async function updatePetitionController(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const rawId = (req.params as any)?.id
    const id = Array.isArray(rawId) ? rawId[0] : rawId

    if (!userId) {
      return res.status(401).json({ error: "Usuario nao autenticado" })
    }
    if (!id) {
      return res.status(400).json({ error: "ID da peticao e obrigatorio" })
    }

    const mappedData = {
      title: req.body.title,
      description: req.body.description,
      type: coercePetitionType(req.body.type),
      status: coercePetitionStatus(req.body.status),
      addressing: req.body.addressing ?? req.body.enderecamento ?? undefined,
      defendant: req.body.defendant ?? req.body.reu ?? undefined,
      facts: req.body.facts ?? req.body.fatos ?? undefined,
      legalBasis: req.body.legalBasis ?? req.body.fundamentos ?? undefined,
      caseValue: req.body.caseValue ?? req.body.valor_causa ?? undefined,
      closingLocation: req.body.closingLocation ?? req.body.local ?? undefined,
      fileUrl: req.body.fileUrl,
      protocolNumber: req.body.protocolNumber,
      processId: req.body.processId,
      clientId: req.body.clientId ?? req.body.client_id ?? undefined,
    }

    const petition = await UpdatePetition(id, userId, mappedData)
    return res.status(200).json(petition)
  } catch (error: any) {
    console.error("Erro ao atualizar peticao:", error)

    if (
      error.message === "Peticao nao encontrada ou nao autorizada" ||
      error.message === "Petição não encontrada ou não autorizada" ||
      error.message === "PetiÃ§Ã£o nÃ£o encontrada ou nÃ£o autorizada"
    ) {
      return res.status(404).json({ error: error.message })
    }

    return res.status(500).json({ error: "Erro ao atualizar peticao" })
  }
}
