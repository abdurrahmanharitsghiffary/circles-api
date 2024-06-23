import { Controller } from "@/decorators/factories/controller";
import { Post } from "@/decorators/factories/httpMethod";
import { UploadAudio } from "@/decorators/factories/uploadAudio";
import { deepgram } from "@/libs/deepgram";
import { Success } from "@/libs/response";
import { AppRequest, AppResponse } from "@/types/express";

@Controller("/stt")
export class SpeechToTextController {
  @Post("/")
  @UploadAudio("single", "audio")
  async handle(req: AppRequest, res: AppResponse) {
    const { language = "id", detect_language = "false" } = req.query;
    const { error, result } = await deepgram.listen.prerecorded.transcribeFile(
      req.file.buffer,
      {
        model: "nova-2",
        language: language.toString(),
        detect_language: detect_language === "true",
      }
    );
    if (error) throw error;
    return res.status(200).json(new Success(result));
  }
}
