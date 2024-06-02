package pl.dfurman.mountaintours.tourparticipant.tourparticipantrepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import pl.dfurman.mountaintours.user.User;

import java.sql.SQLException;
import java.util.List;

@Repository
public class JdbcTourParticipant implements TourParticipantDAO{

    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Override
    public int addParticipant(Long tourId, Long participantId) throws SQLException {
        return jdbcTemplate.update("INSERT INTO tour_participants (tour_id, participant_id) VALUES (?, ?)", tourId, participantId);
    }

    @Override
    public int getNumberOfParticipantsForTour(Long tourId) throws SQLException {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM tour_participants WHERE tour_id = ?",Integer.class, tourId);
    }

    @Override
    public boolean isParticipant(Long tourId, Long participantId) throws SQLException {
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM tour_participants WHERE tour_id = ? AND participant_id = ?",
                Integer.class, tourId, participantId);
        return count == 1;
    }

    @Override
    public int resignFromTour(Long tourId, Long participantId) throws SQLException {
        return jdbcTemplate.update("""
        DELETE FROM tour_participants WHERE tour_id = ? AND participant_id = ?
        """, tourId, participantId);
    }

    @Override
    public List<User> getAllParticipantsInfoByTourId(Long tourId) throws SQLException {
        return jdbcTemplate.query("""
                SELECT u.* FROM users u JOIN tour_participants tp ON tp.participant_id = u.id WHERE tp.tour_id = ?
                """, BeanPropertyRowMapper.newInstance(User.class), tourId);
    }

    @Override
    public boolean isParticipantInAnyTour(Long participantId) throws SQLException {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM tour_participants WHERE participant_id = ?",
                Integer.class,
                participantId
        );
        return count != null && count > 0;
    }
}
