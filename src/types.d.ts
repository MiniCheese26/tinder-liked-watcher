export interface TinderLikes {
  data: Data;
}

export interface Data {
  results: Result[];
}

export interface Result {
  user: User;
}

export interface User {
  _id:             string;
  photos:          Photo[];
  recently_active: boolean;
}

export interface Photo {
  id:             string;
  crop_info:      CropInfo;
  url:            string;
  processedFiles: ProcessedFile[];
  fileName:       string;
  extension:      Extension;
  media_type:     MediaType;
}

export interface SaveType {
  id: string,
  time: string,
  photoUrl: string
}
