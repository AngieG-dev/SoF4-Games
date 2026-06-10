export interface Friend {
    friendshipId: number
    userId:       string
    displayName:  string | null
    username:     string | null
    avatarUrl:    string | null
}

export interface PendingRequest {
    friendshipId: number
    requesterId:  string
    username:     string | null
    displayName:  string | null
    avatarUrl:    string | null
}

export interface SentRequest {
    friendshipId: number
    addresseeId:  string
    username:     string | null
    displayName:  string | null
    avatarUrl:    string | null
}

export interface UserSearchResult {
    userId:      string
    username:    string | null
    displayName: string | null
    avatarUrl:   string | null
}