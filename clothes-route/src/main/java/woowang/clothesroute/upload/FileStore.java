package woowang.clothesroute.upload;

import com.drew.imaging.ImageMetadataReader;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.MetadataException;
import com.drew.metadata.Tag;
import com.drew.metadata.exif.ExifIFD0Directory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.imgscalr.Scalr;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import woowang.clothesroute.dto.UploadFile;
import woowang.clothesroute.repository.FileRepository;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class FileStore {

    @Value("${file.dir}")
    private String fileDir;

    @Value("${rembgFile.dir}")
    private String rembgFileDir;

    private final FileRepository fileRepository;

    public String getFullPath(String filename) {
        return fileDir + filename;
    }

    public String getRemovedFullPath(String fileName){return rembgFileDir+fileName;}

    public List<UploadFile> storeFiles(List<MultipartFile> multipartFiles)
            throws IOException, ImageProcessingException, MetadataException {
        List<UploadFile> storeFileResult = new ArrayList<>();
        for (MultipartFile multipartFile : multipartFiles) {
            if (!multipartFile.isEmpty()) {
                storeFileResult.add(storeFile(multipartFile));
            } }
        return storeFileResult;
    }
    public UploadFile storeFile(MultipartFile multipartFile) throws IOException, ImageProcessingException, MetadataException {
        if (multipartFile.isEmpty()) {
            return null;
        }
        String originalFilename = multipartFile.getOriginalFilename();
        String storeFileName = createStoreFileName(originalFilename);

        BufferedImage img = rotateAndResizeImg(multipartFile);

        ImageIO.write(Scalr.resize(img,400),extractExt(originalFilename),new File(getFullPath(storeFileName)));

//        multipartFile.transferTo(new File(getFullPath(storeFileName)));
        UploadFile uploadFile = new UploadFile(originalFilename, storeFileName);
        fileRepository.save(uploadFile);
        return uploadFile;
    }

    private BufferedImage rotateAndResizeImg(MultipartFile multipartFile) throws IOException, ImageProcessingException {

        BufferedImage srcImg = ImageIO.read(multipartFile.getInputStream());

        BufferedInputStream inputStream = new BufferedInputStream(multipartFile.getInputStream());
        Metadata metadata = ImageMetadataReader.readMetadata(inputStream, true);
        int orientation = 0;
        try {
            orientation = metadata.getDirectory(ExifIFD0Directory.class).getInt(ExifIFD0Directory.TAG_ORIENTATION);
        } catch (Exception e) {
            log.info("no metadata");
            return Scalr.resize(srcImg,400);
        }


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

    private String createStoreFileName(String originalFilename) {
        String ext = extractExt(originalFilename);
        String uuid = UUID.randomUUID().toString();
        return uuid + "." + ext;
    }
    private String extractExt(String originalFilename) {
        int pos = originalFilename.lastIndexOf(".");
        return originalFilename.substring(pos + 1);
    }
}
