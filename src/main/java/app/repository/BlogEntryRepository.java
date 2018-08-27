package app.repository;

import app.domain.BlogEntry;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the BlogEntry entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BlogEntryRepository extends JpaRepository<BlogEntry, Long> {

}
