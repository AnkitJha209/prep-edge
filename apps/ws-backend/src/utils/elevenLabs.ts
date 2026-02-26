import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const elevenlabs = new ElevenLabsClient();

export const textToSpeech = async (greetingText: string) => {
    const audioStream = await elevenlabs.textToSpeech.convert(
        "JBFqnCBsd6RMkjVDRZzb",
        {
            text: greetingText,
            modelId: "eleven_multilingual_v2",
            outputFormat: "mp3_44100_128",
        },
    );

    const arrayBuffer = await new Response(audioStream).arrayBuffer();

    const audioBuffer = Buffer.from(arrayBuffer);

    return audioBuffer;
};

export const speechToText = async (audioBuffer: any) => {
    try {
        const audioBlob = new Blob([await audioBuffer], {
            type: "audio/webm",
        });
        const transcription = await elevenlabs.speechToText.convert({
            file: audioBlob,
            modelId: "scribe_v2", // Model to use
            tagAudioEvents: true, // Tag audio events like laughter, applause, etc.
            languageCode: "eng", // Language of the audio file. If set to null, the model will detect the language automatically.
            diarize: true, // Whether to annotate who is speaking
        });

        const text = transcription.text

        return text;
    } catch (error) {
        console.log(error);
        throw new Error("Can not convert the speech to text");
    }
};
