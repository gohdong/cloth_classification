package woowang.clothesroute.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import woowang.clothesroute.dto.UploadFile;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Repository
@Transactional
public class FileRepository {

    @PersistenceContext
    EntityManager em;

    public void save(UploadFile uploadFile){
        em.persist(uploadFile);
    }

    public UploadFile findByUploadName(String uploadName){
        String sql = "select f from UploadFile f where f.uploadName = :uploadName";
        return em.createQuery(sql,UploadFile.class)
                .setParameter("uploadName",uploadName).getSingleResult();
    }
}
