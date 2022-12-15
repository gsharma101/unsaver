export type Collection = {
    collection_id: number | "ALL_MEDIA_AUTO_COLLECTION" | "AUDIO_AUTO_COLLECTION";
    collection_media_count: number;
    collection_name: string;
    collection_type: "MEDIA" | "ALL_MEDIA_AUTO_COLLECTION" | "AUDIO_AUTO_COLLECTION";
    cover_media_list?: {
        image_versions2: Image2Versions;
    }[];
}

export type Image2Versions = {
    candidates: Image[];
}

export type Image = {
    height: number;
    width: number;
    url: string;
}

export type MediaEnvelope = {
    media: Media;
}

export type BaseMedia = {
    id: string;
    code: string;
    media_type: number;
};

export type Media = BaseMedia & (ImageMedia | VideoMedia | CarouselMedia);

export type ImageMedia = {
    image_versions2: Image2Versions;
};

export type VideoMedia = {
    image_versions2: Image2Versions;
    video_versions: Video[];
};

export type Video = {
    height: number;
    width: number;
    type: number;
    url: string;
    id: string;
};

export type CarouselMedia = {
    carousel_media: (BaseMedia & ImageMedia | BaseMedia & VideoMedia)[];
    carousel_media_count: number;
};

type CollectionResponse<T> = {
    auto_load_more_enabled: boolean;
    status: string;
    more_available: boolean;
    items: T[];
    next_max_id?: string;
    num_results?: number;
}

export default class Endpoints {
    private defaultOptions: RequestInit;

    constructor() {
        this.defaultOptions = {
            headers: {
                "accept": "*/*",
                "sec-ch-ua-mobile": "?0",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "sec-gpc": "1",
                "x-ig-app-id": "936619743392459"
            },
            referrer: "https://www.instagram.com/",
            credentials: 'include',
            mode: 'cors',
        };
    }

    public async getCollections(maxId: string = ""): Promise<CollectionResponse<Collection>> {
        const response = await fetch('https://i.instagram.com/api/v1/collections/list/?collection_types=["ALL_MEDIA_AUTO_COLLECTION","MEDIA","AUDIO_AUTO_COLLECTION"]' +
            "&include_public_only=0" +
            "&get_cover_media_lists=true" +
            `&max_id=${maxId}`,
            {
                method: 'GET',
                ...this.defaultOptions,
            });

        if (response.status !== 200) throw new Error(`Failed to get collections. Status: ${response.status} ${response.statusText}`);

        return await response.json();
    }

    public async getCollectionMedia(collectionId: number, maxId: string = ""): Promise<CollectionResponse<Media>> {
        const response = await fetch(`https://i.instagram.com/api/v1/feed/collection/${collectionId}/posts/?max_id=${maxId}`,
            {
                method: 'GET',
                ...this.defaultOptions,
            });
        let json = await response.json();
        json["items"] = json.items.map((item: MediaEnvelope) => item.media);
        return json;
    }

    public async getAllSavedMedia(maxId: string = ""): Promise<CollectionResponse<Media>> {
        const response = await fetch(`https://i.instagram.com/api/v1/feed/saved/posts/?max_id=${maxId}`,
            {
                method: 'GET',
                ...this.defaultOptions,
            });
        let json = await response.json();
        json["items"] = json.items.map((item: MediaEnvelope) => item.media);
        return json;

    }


}