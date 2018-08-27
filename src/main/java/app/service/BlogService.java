package app.service;

import app.domain.Blog;
import app.repository.BlogRepository;
import app.repository.search.BlogSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Blog.
 */
@Service
@Transactional
public class BlogService {

    private final Logger log = LoggerFactory.getLogger(BlogService.class);

    private final BlogRepository blogRepository;

    private final BlogSearchRepository blogSearchRepository;

    public BlogService(BlogRepository blogRepository, BlogSearchRepository blogSearchRepository) {
        this.blogRepository = blogRepository;
        this.blogSearchRepository = blogSearchRepository;
    }

    /**
     * Save a blog.
     *
     * @param blog the entity to save
     * @return the persisted entity
     */
    public Blog save(Blog blog) {
        log.debug("Request to save Blog : {}", blog);
        Blog result = blogRepository.save(blog);
        blogSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the blogs.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<Blog> findAll(Pageable pageable) {
        log.debug("Request to get all Blogs");
        return blogRepository.findAll(pageable);
    }

    /**
     * Get one blog by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Blog findOne(Long id) {
        log.debug("Request to get Blog : {}", id);
        return blogRepository.findOne(id);
    }

    /**
     * Delete the blog by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Blog : {}", id);
        blogRepository.delete(id);
        blogSearchRepository.delete(id);
    }

    /**
     * Search for the blog corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<Blog> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Blogs for query {}", query);
        Page<Blog> result = blogSearchRepository.search(queryStringQuery(query), pageable);
        return result;
    }
}
