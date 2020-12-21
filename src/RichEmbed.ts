export class RichEmbed {
    public title?: string;
    public description?: string;
    public url?: string;
    public timestamp?: Date;
    public color?: number;
    public footer?: {
        text: string,
        iconURL?: string
    }
    public image?: {
        url: string,
        height?: number,
        width?: number
    }
    public thumbnail?: {
        url: string,
        height?: number,
        width?: number
    }
    public video?: {
        url: string,
        height?: number,
        width?: number
    }
    public author?: {
        name: string,
        url?: string,
        iconURL?: string
    }
    public fields: { name: string, value: string, inline?: boolean }[] = [];
    
    public setTitle(n: string) {
        this.title = n;
        return this;
    }

    public setDescription(n: string) {
        this.description = n;
        return this;
    }

    public setURL(n: string) {
        this.url = n;
        return this;
    }

    public setColor(n: number) {
        this.color = n;
        return this;
    }

    public setTimestamp(n: Date = new Date()) {
        this.timestamp = n;
        return this;
    }

    public setFooter(text: string, iconURL?: string) {
        this.footer = {
            text,
            iconURL
        };
        return this;
    }

    public setImage(url: string, height?: number, width?: number) {
        this.image = {
            url,
            height,
            width
        };
        return this;
    }

    public setThumbnail(url: string, height?: number, width?: number) {
        this.thumbnail = {
            url,
            height,
            width
        };
        return this;
    }

    public setVideo(url: string, height?: number, width?: number) {
        this.video = {
            url,
            height,
            width
        };
        return this;
    }

    public setAuthor(name: string, iconURL?: string, url?: string) {
        this.author = {
            name,
            iconURL,
            url
        };
        return this;
    }

    public addField(title: string, value: string, inline?: boolean) {
        this.fields.push({
            name: title,
            value,
            inline
        });
        return this;
    }

    public toJSON() {
        const object: Record<string, unknown> = {
            title: this.title,
            description: this.description,
            url: this.url,
            timestamp: this.timestamp?.toISOString(),
            color: this.color,
            fields: this.fields
        };

        if(this.author) {
            object.author = {
                name: this.author.name,
                url: this.author.url,
                icon_url: this.author.iconURL
            };
        }

        if(this.footer) {
            object.footer = {
                text: this.footer.text,
                icon_url: this.footer.iconURL
            }
        }

        if(this.image) {
            object.image = {
                url: this.image.url,
                height: this.image.height,
                width: this.image.width
            }
        }

        if(this.thumbnail) {
            object.thumbnail = {
                url: this.thumbnail.url,
                height: this.thumbnail.height,
                width: this.thumbnail.width
            }
        }

        if(this.video) {
            object.video = {
                url: this.video.url,
                height: this.video.height,
                width: this.video.width
            }
        }

        return object;
    }
}