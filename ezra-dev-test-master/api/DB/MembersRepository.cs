using System;
using System.Collections.Generic;
using System.Linq;
using EzraTest.Models;

using Microsoft.Data.Sqlite;

namespace EzraTest.DB
{
    public class MembersRepository : IMembersRepository
    {
        private string _connectionString;

        public MembersRepository(string connectionString)
        {
            _connectionString = $"Data Source={connectionString}";
        }

        /// <inheritdoc />
        public IEnumerable<Member> GetMembers()
        {
            return ExecuteQuery("SELECT * FROM MEMBERS", (reader) =>
            {
                return new Member
                {
                    Id = reader.GetGuid(0),
                    Name = reader.GetString(1),
                    Email = reader.GetString(2)
                };
            });
        }

        /// <inheritdoc />
        public Member GetMember(Guid id)
        {
            return ExecuteQuery($"SELECT * FROM MEMBERS WHERE Id = '{id:N}'", (reader) =>
            {
                return new Member
                {
                    Id = Guid.Parse(reader.GetString(0)),
                    Name = reader.GetString(1),
                    Email = reader.GetString(2)
                };
            }).FirstOrDefault();
        }

        /// <inheritdoc />
        public void AddMember(Member member)
        {
            ExecuteNonQuery($"INSERT INTO MEMBERS (Id, Name, Email) VALUES(@Id, @Name, @Email)", member);
        }

        /// <inheritdoc />
        public void UpdateMember(Guid id, Member member)
        {
            ExecuteNonQuery($"Update MEMBERS SET Name=@Name, Email=@Email WHERE Id = @Id", member);
        }

        /// <inheritdoc />
        public void DeleteMember(Guid id)
        {
            ExecuteScalar($"DELETE FROM MEMBERS WHERE Id = @Id", id);
        }

        private IEnumerable<T> ExecuteQuery<T>(string commandText, Func<SqliteDataReader, T> func)
        {
            using (var connection = new SqliteConnection(_connectionString))
            {
                connection.Open();

                var command = connection.CreateCommand();
                command.CommandText = commandText;

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        yield return func(reader);
                    }
                }
            }
        }

        // Called when either Insert or Update operation is to be performed
        private void ExecuteNonQuery(string commandText, Member member)
        {
            using (var connection = new SqliteConnection(_connectionString))
            {
                connection.Open();

                var command = connection.CreateCommand();
                command.CommandText = commandText;

                if (member.Id == Guid.Empty)
                {
                    member.Id = Guid.NewGuid();
                }

                command.Parameters.AddWithValue("@Id", (member.Id).ToString("N"));
                command.Parameters.AddWithValue("@Name", member.Name);
                command.Parameters.AddWithValue("@Email", member.Email);
                command.Prepare();

                command.ExecuteNonQuery();
            }
        }

        // Called when either Delete operation is to be performed
        private void ExecuteScalar(string commandText, Guid id)
        {
            using (var connection = new SqliteConnection(_connectionString))
            {
                connection.Open();

                var command = connection.CreateCommand();
                command.CommandText = commandText;
                command.Parameters.AddWithValue("@Id", (id).ToString("N"));
                command.Prepare();

                command.ExecuteScalar();
            }
        }
    }
}