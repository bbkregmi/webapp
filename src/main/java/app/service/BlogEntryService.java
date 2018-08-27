package app.service;

import app.domain.BlogEntry;
import app.repository.BlogEntryRepository;
import app.repository.search.BlogEntrySearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing BlogEntry.
 */
@Service
@Transactional
public class BlogEntryService {

    private final Logger log = LoggerFactory.getLogger(BlogEntryService.class);

    private final BlogEntryRepository blogEntryRepository;

    private final BlogEntrySearchRepository blogEntrySearchRepository;

    public BlogEntryService(BlogEntryRepository blogEntryRepository, BlogEntrySearchRepository blogEntrySearchRepository) {
        this.blogEntryRepository = blogEntryRepository;
        this.blogEntrySearchRepository = blogEntrySearchRepository;
    }

    /**
     * Save a blogEntry.
     *
     * @param blogEntry the entity to save
     * @return the persisted entity
     */
    public BlogEntry save(BlogEntry blogEntry) {
        log.debug("Request to save BlogEntry : {}", blogEntry);
        BlogEntry result = blogEntryRepository.save(blogEntry);
        blogEntrySearchRepository.save(result);
        return result;
    }

    /**
     * Get all the blogEntries.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<BlogEntry> findAll(Pageable pageable) {
        log.debug("Request to get all BlogEntries");
        return blogEntryRepository.findAll(pageable);
    }

    /**
     * Get one blogEntry by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public BlogEntry findOne(Long id) {
        log.debug("Request to get BlogEntry : {}", id);
        return blogEntryRepository.findOne(id);
    }

    /**
     * Delete the blogEntry by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete BlogEntry : {}", id);
        blogEntryRepository.delete(id);
        blogEntrySearchRepository.delete(id);
    }

    /**
     * Search for the blogEntry corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<BlogEntry> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of BlogEntries for query {}", query);
        Page<BlogEntry> result = blogEntrySearchRepository.search(queryStringQuery(query), pageable);
        return result;
    }
}
