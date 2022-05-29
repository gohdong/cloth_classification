package woowang.clothesroute.utils;


import com.drew.imaging.ImageMetadataReader;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.Metadata;
import com.drew.metadata.MetadataException;
import com.drew.metadata.exif.ExifIFD0Directory;
import org.imgscalr.Scalr;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;

public class ImageUtils {

    static public BufferedImage rotateAndResizeImg(InputStream stream) throws IOException, ImageProcessingException, MetadataException {
        BufferedInputStream inputStream = new BufferedInputStream(stream);
        Metadata metadata = ImageMetadataReader.readMetadata(inputStream, true);
//        for (Directory directory : metadata.getDirectories()) {
//            for (Tag tag : directory.getTags()) {
//                log.info("tag = {}{}{}{}",tag.getTagName(),tag.getTagType(),tag.getDescription(),tag.getDirectoryName());
//            }
//        }
        int orientation = metadata.getDirectory(ExifIFD0Directory.class).getInt(ExifIFD0Directory.TAG_ORIENTATION);
        BufferedImage srcImg = ImageIO.read(stream);

        switch (orientation) {
            case 6:
                srcImg = Scalr.rotate(srcImg, Scalr.Rotation.CW_90, null);
                break;
            case 1:

                break;
            case 3:
                srcImg = Scalr.rotate(srcImg, Scalr.Rotation.CW_180, null);
                break;
            case 8:
                srcImg = Scalr.rotate(srcImg, Scalr.Rotation.CW_270, null);
                break;

            default:
                orientation=1;
                break;
        }
        return Scalr.resize(srcImg,400);
    }
}