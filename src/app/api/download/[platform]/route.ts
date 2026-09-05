// CURRENT IMPLEMENTATION ONLY ALLOWS YOUTUBE DOWNLOADING
import { NextRequest } from "next/server";
import ytdl, { videoFormat } from '@distube/ytdl-core';

export async function GET(request: NextRequest, { params }: { params: { platform: string } }
) {
    const searchParams = request.nextUrl.searchParams
    const url = searchParams.get('videoUrl')
    if (!url) {
        return new Response('Missing videoUrl parameter', { status: 400 })
    }
    switch (params.platform) {
        case 'youtube':
            return await PlatformYoutube(url)
        case "facebook":
            return new Response('Not implemented', { status: 501 })
        default:
            return new Response('Invalid platform parameter', { status: 400 })
    }
   
  
}
// USING REGEX FOR EXTRACTING THE VIDEOID
function extractVideoId(videoUrl: string): string | null {
    const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s?]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
    const match = videoUrl.match(regex);
    return match ? match[1] : null;
}

async function PlatformYoutube(videoUrl : string){
    const videoId = extractVideoId(videoUrl)
    if (!videoId) {
        return new Response('Invalid videoUrl parameter', { status: 400 })
    }
    
    const videoDetails = await ytdl.getInfo(videoId)
    // container is the extension, like .mp4 or .mp3 etc
    // quality label represents the quality e.g 720p or 1080p
    // i tag represents the quality without the p, like 720 or 1080.   
    const formats = videoDetails.formats.map((format : videoFormat) => {
        return {
            container : format.container,
            quality : format.qualityLabel,
            url : format.url,
            itag : format.itag
        }
    })
    const value = {
        title: videoDetails.videoDetails.title,
        lengthSeconds: videoDetails.videoDetails.lengthSeconds,
        formats,
        thumbnail: videoDetails.videoDetails.thumbnails[0].url,
    }
    
    return new Response(JSON.stringify(value), {
        headers: {
            'content-type': 'application/json',
        },
    })
}
