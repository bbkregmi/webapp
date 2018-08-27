package app.web.rest;

import com.codahale.metrics.annotation.Timed;
import app.domain.BlogEntry;
import app.service.BlogEntryService;
import app.web.rest.errors.BadRequestAlertException;
import app.web.rest.util.HeaderUtil;
import app.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing BlogEntry.
 */
@RestController
@RequestMapping("/api")
public class BlogEntryResource {

    private final Logger log = LoggerFactory.getLogger(BlogEntryResource.class);

    private static final String ENTITY_NAME = "blogEntry";

    private final BlogEntryService blogEntryService;

    public BlogEntryResource(BlogEntryService blogEntryService) {
        this.blogEntryService = blogEntryService;
    }

    /**
     * POST  /blog-entries : Create a new blogEntry.
     *
     * @param blogEntry the blogEntry to create
     * @return the ResponseEntity with status 201 (Created) and with body the new blogEntry, or with status 400 (Bad Request) if the blogEntry has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/blog-entries")
    @Timed
    public ResponseEntity<BlogEntry> createBlogEntry(@Valid @RequestBody BlogEntry blogEntry) throws URISyntaxException {
        log.debug("REST request to save BlogEntry : {}", blogEntry);
        if (blogEntry.getId() != null) {
            throw new BadRequestAlertException("A new blogEntry cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BlogEntry result = blogEntryService.save(blogEntry);
        return ResponseEntity.created(new URI("/api/blog-entries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /blog-entries : Updates an existing blogEntry.
     *
     * @param blogEntry the blogEntry to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated blogEntry,
     * or with status 400 (Bad Request) if the blogEntry is not valid,
     * or with status 500 (Internal Server Error) if the blogEntry couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/blog-entries")
    @Timed
    public ResponseEntity<BlogEntry> updateBlogEntry(@Valid @RequestBody BlogEntry blogEntry) throws URISyntaxException {
        log.debug("REST request to update BlogEntry : {}", blogEntry);
        if (blogEntry.getId() == null) {
            return createBlogEntry(blogEntry);
        }
        BlogEntry result = blogEntryService.save(blogEntry);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, blogEntry.getId().toString()))
            .body(result);
    }

    /**
     * GET  /blog-entries : get all the blogEntries.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of blogEntries in body
     */
    @GetMapping("/blog-entries")
    @Timed
    public ResponseEntity<List<BlogEntry>> getAllBlogEntries(Pageable pageable) {
        log.debug("REST request to get a page of BlogEntries");
        Page<BlogEntry> page = blogEntryService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/blog-entries");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /blog-entries/:id : get the "id" blogEntry.
     *
     * @param id the id of the blogEntry to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the blogEntry, or with status 404 (Not Found)
     */
    @GetMapping("/blog-entries/{id}")
    @Timed
    public ResponseEntity<BlogEntry> getBlogEntry(@PathVariable Long id) {
        log.debug("REST request to get BlogEntry : {}", id);
        BlogEntry blogEntry = blogEntryService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(blogEntry));
    }

    /**
     * DELETE  /blog-entries/:id : delete the "id" blogEntry.
     *
     * @param id the id of the blogEntry to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/blog-entries/{id}")
    @Timed
    public ResponseEntity<Void> deleteBlogEntry(@PathVariable Long id) {
        log.debug("REST request to delete BlogEntry : {}", id);
        blogEntryService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/blog-entries?query=:query : search for the blogEntry corresponding
     * to the query.
     *
     * @param query the query of the blogEntry search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/blog-entries")
    @Timed
    public ResponseEntity<List<BlogEntry>> searchBlogEntries(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of BlogEntries for query {}", query);
        Page<BlogEntry> page = blogEntryService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/blog-entries");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
